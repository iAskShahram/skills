---
name: windows-mcp-screenshot
description: Take screenshots of a Windows desktop with the Windows-MCP server (CursorTouch/Windows-MCP), covering a full screen, one monitor, or a region, and save them to disk. Use when the user asks to screenshot, capture, or look at the Windows screen and `mcp__windows-mcp__*` tools (Screenshot, Snapshot, DisplayInventory) are available.
---

# Windows-MCP screenshots

Windows-MCP (`windows-mcp serve`, v0.8.x) exposes desktop capture as MCP tools. The image comes back **inline in the tool result** as a PNG. The server does not write it to disk. To get a file, see [Save to a file](#save-to-a-file).

## Pick the tool

| Need | Call |
|------|------|
| See the screen (default) | `Screenshot` |
| See the screen **and** get clickable element ids/coords | `Snapshot` with `use_vision=true` |
| Monitor indices, bounds, DPI | `DisplayInventory` |
| A PNG on disk | `scripts/save-screenshot.ps1` |

`Screenshot` skips the UI-tree walk, so it is the fast path. `Snapshot` does not return an image unless `use_vision=true`.

## Screenshot parameters

| Param | Default | Notes |
|-------|---------|-------|
| `display` | all monitors | Zero-based indices, e.g. `[0]` or `[0,1]`. Get them from `DisplayInventory`. |
| `region` | none | `[left, top, right, bottom]` in virtual-desktop pixels. Overrides `display`. |
| `use_annotation` | `false` | Draws a cursor marker. Required for the grid. |
| `width_reference_line`, `height_reference_line` | none | Number of grid **columns / rows**, not line positions. A grid is drawn only when both are set **and** `use_annotation=true`. |

## Recipes

Full desktop (all monitors):
```json
Screenshot {}
```

One monitor. Call `DisplayInventory` first if you don't know the index:
```json
Screenshot { "display": [0] }
```

A specific area. This uses fewer tokens than a full capture:
```json
Screenshot { "region": [690, 440, 1515, 610] }
```

With a 4x3 grid to help with spatial reasoning:
```json
Screenshot { "use_annotation": true, "width_reference_line": 4, "height_reference_line": 3 }
```

## Reading the result

The text block comes before the image. Check it every time:

- `Screenshot Size: (w,h)`: the image is full resolution. Image px = screen px (+ region offset).
- `Screenshot Original Size` + `Screenshot Coordinate Scale: k`: the image was downscaled. This happens when it is larger than 1920x1080, or when `WINDOWS_MCP_SCREENSHOT_SCALE` < 1. Convert with `screen = (img_x * k + region_left, img_y * k + region_top)`. The tool's own hint leaves out the region offset. Add it yourself when you passed `region`.
- `Screenshot Backend:` shows which capturer ran (`dxcam` / `mss` / `pillow`).
- `Focused Window` / `Opened Windows` can come back empty from `Screenshot`. Use `Snapshot` if you need the window list.

## Errors and gotchas

- **Errors come back as plain text, not as tool errors.** A failed call returns a single text block that starts with `Error capturing screenshot: ...` and contains no image. Always check for it.
- **Never call these tools in parallel.** Concurrent calls fail with `CONTROL_UNAVAILABLE`. Make one call at a time.
- **`USER_CONTROL` + `wait_seconds`** means the user moved the mouse or pressed keys, and the AI gives up control until roughly 10 s of idle. Wait `wait_seconds`, check `ControlStatus` until `state` is `"ai"`, then retry. Don't fight the user for the desktop.
- **Region rules:** `right > left` and `bottom > top`, otherwise you get an error. A region that doesn't overlap the screen is also an error. A region that **partly** extends past the screen is *not* clipped. The off-screen part comes back black, so clamp it to the `DisplayInventory` bounds yourself.
- **Invalid `display` index** returns `Invalid display index N. Available displays: ...`.
- **`region` fails with `No module named 'cv2'`:** the default `auto` backend tries dxcam, and dxcam needs OpenCV to crop. Full-screen captures still work. Fix it in the server config (see below) with `WINDOWS_MCP_SCREENSHOT_BACKEND=pillow`, or install `opencv-python` into the windows-mcp environment. Until then, take a full `Screenshot`, or use the save script with `-Region`.
- A brief orange-red border flashes on screen after each capture. It is drawn after the grab and never shows in the image.

## Server environment variables

Set these in the MCP client config under the server's `env` key, then restart the server:

```json
"windows-mcp": {
  "command": "windows-mcp",
  "args": ["serve"],
  "env": {
    "WINDOWS_MCP_SCREENSHOT_BACKEND": "pillow",
    "WINDOWS_MCP_SCREENSHOT_SCALE": "0.5",
    "WINDOWS_MCP_DISABLE_FLASH": "1"
  }
}
```

| Var | Values | Use |
|-----|--------|-----|
| `WINDOWS_MCP_SCREENSHOT_BACKEND` | `auto` (dxcam→mss→pillow), `dxcam`, `mss`, `pillow` | Set to `pillow` if region capture errors, or on VMs/RDP. |
| `WINDOWS_MCP_SCREENSHOT_SCALE` | `0.1`–`1.0` | Shrink images to fit client size limits (e.g. 1 MB in Claude Desktop) on 1440p/4K. |
| `WINDOWS_MCP_DISABLE_FLASH` | `1` | Turn off the capture border flash. |
| `WINDOWS_MCP_PROFILE_SNAPSHOT` | `1` | Log per-stage timings for slow captures. |

## Save to a file

Windows-MCP has no save option. Run [`scripts/save-screenshot.ps1`](scripts/save-screenshot.ps1) from a local shell. If the agent's shell is not on the target machine, pass its contents to the Windows-MCP `PowerShell` tool. The script is DPI-aware, so it captures physical pixels, and it uses the same virtual-desktop coordinates as `region`.

```powershell
# Full virtual desktop
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/save-screenshot.ps1 -Out C:\tmp\desktop.png
# One monitor or area: left, top, right, bottom (same as Screenshot's region)
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/save-screenshot.ps1 -Out C:\tmp\area.png -Region 0,0,1920,1080
```

It prints the saved path and size. Open the file to confirm it shows what you expected.

Some clients persist inline images too. Claude Code, for example, appends `[Image: source: <path>.png]` to the result, and you can copy that file instead.
