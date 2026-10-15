---
name: screencast
description: Captures screenshots and records screen video on Windows through the screencast MCP server (@tmhs/screencast-mcp), then samples frames so the agent can see the footage and edits it with ffmpeg (trim, crop, redact, convert, export). Use when the user wants to capture a screenshot, record a video of the screen, or view, cut, or export a recording.
---

# Screencast

Use the `screencast` MCP server ([TMHSDigital/screencast-mcp](https://github.com/TMHSDigital/screencast-mcp)) to capture the Windows screen, turn footage into frames you can look at, and edit the result with ffmpeg. Tools appear as `mcp__screencast__<tool>`.

Capture uses gdigrab, so `screenshot` and `start_recording` only work on Windows. Watch and edit tools run anywhere ffmpeg runs.

## Setup

Needs `ffmpeg` and `ffprobe` on PATH (or set `FFMPEG_PATH` / `FFPROBE_PATH`).

```bash
npm install -g @tmhs/screencast-mcp
```

```json
{
  "mcpServers": {
    "screencast": {
      "command": "npx",
      "args": ["-y", "@tmhs/screencast-mcp"]
    }
  }
}
```

If the `mcp__screencast__*` tools are missing, tell the user to add the server. Do not fall back to ad-hoc ffmpeg commands for capture.

## Targets

Every capture tool takes a `target` string:

| Target | Captures |
|--------|----------|
| `full` | The whole virtual desktop |
| `monitor:<index>` | One display at its real pixel bounds. `monitor:0` is primary, `monitor:1` is the second display |
| `window:<title>` | A window's on-screen rectangle. Case-insensitive exact title first, then substring; topmost match wins. Window must be visible, on top, and not minimized. For recordings it's resolved once at start and does not follow the window if it moves |
| `region:<x>,<y>,<w>,<h>` | An exact pixel rectangle in absolute coordinates |

## Screenshot

One call. Returns the PNG path. Read the PNG to see it.

```
screenshot { target: "window:Visual Studio Code" }
```

## Record video

1. `start_recording` with a `target`. Optional: `fps` (default 30), `quality` (`draft` | `standard` | `high`), `audio`, `output`, `maxDurationSec` (default 3600; `0` = no cap).
   Done when: you have the returned `sessionId` and output path.
2. Do the thing being recorded.
3. `stop_recording { sessionId }`. This quits ffmpeg cleanly so the file is finalized, not truncated.
   Done when: it returns the final path and duration.

Always stop the sessions you start. Use `list_sessions` / `get_session` to find a lost id.

System audio: pass `audio: { source: "system" }`. This needs a virtual-audio loopback device because Windows has no native loopback. Run `list_audio_devices` to find one and pass it as `audio.device` if auto-detection fails. Microphone capture is not supported.

## Watch: view what was recorded

A video file is opaque to you. Convert it to frames, then read the PNGs.

| Tool | Use |
|------|-----|
| `sample_frames` | `fps` for a full pass (e.g. `0.5`), or `timestamps: [3, 12.5]` to check exact moments. The two are mutually exclusive |
| `get_media_info` | Duration, resolution, fps, codecs, format, size |

Check `get_media_info` before picking timestamps or crop rectangles.

## Edit

Inputs are validated. A bad rectangle, odd dimension, or wrong duration fails with a message that says how to fix it. Tools refuse to replace a file at a caller-supplied `output` path unless `overwrite: true` is passed. Default output paths are always unique.

| Tool | What it does |
|------|--------------|
| `trim` | Cut a sub-clip by start + end or duration. Stream copy, snaps to keyframes |
| `clip` | Extract one or more frame-accurate segments to separate files |
| `concat` | Join two or more videos |
| `convert` | Convert between mp4, gif, and webm |
| `crop` | Crop to a pixel rectangle. An off-frame rectangle is rejected |
| `scale` | Resize to width and/or height. Keeps aspect when only one side is given |
| `speed` | Change playback speed by a factor. Audio is retempo'd when present |
| `overlay` | Composite a logo, watermark, or picture-in-picture, optionally scaled and time-limited |
| `compress` | Re-encode smaller with a CRF ladder and optional width cap |
| `extract_audio` | Write the audio track to its own file (mp3, aac, wav, or copy) |
| `redact_region` | Cover declared rectangles with `box` (default, irreversible), `blur`, or `pixelate`. Regions can be time-limited. Not automatic detection |

Use `trim` for quick rough cuts. Use `clip` when the cut must land on an exact frame.

## Produce

Mixed inputs are normalized to a common resolution, fps, and audio rate before they're combined.

| Tool | What it does |
|------|--------------|
| `assemble_highlights` | Stitch two or more clips with hard cuts or an xfade between each |
| `xfade_transition` | Crossfade two videos |
| `title_card` | Standalone title card with centered text on a solid background |
| `music_bed` | Lay music under a video: looped/trimmed, faded, leveled, mixed with existing audio |
| `reframe` | Re-aspect to 16:9, 9:16, 1:1, or 4:5 with `pad` (letterbox) or `crop` (fill) |
| `export_preset` | Platform-ready encode: `youtube`, `instagram_reel`, `tiktok`, `x`, `square` |

## Windows gotchas

- Fullscreen-exclusive apps can record black frames under gdigrab. Switch the app to borderless-windowed mode.
- A minimized or covered window can't be captured with `window:`. Bring it to the front first.
- Region coordinates are absolute desktop pixels, not per-monitor.

## Safety

The screen can show secrets: tokens, emails, private messages.

- Only capture when the user asks. Never start a recording on your own.
- Output stays on the local filesystem. Don't upload or share it unless asked.
- Before sharing a file, sample frames and check them. Use `redact_region` with the default `box` style on anything sensitive; blur and pixelate can be partly reversed.
- Never commit captured media to a repo.
