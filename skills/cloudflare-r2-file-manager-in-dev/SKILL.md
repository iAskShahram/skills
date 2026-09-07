---
name: cf-r2-file
description: Uploads a local file to Cloudflare R2 bucket `public` with wrangler and returns the public URL on assets.shahram.dev. Use when the user wants a public link, public URL, or to host/upload a local image or file to R2.
---

# cf-r2-file

Upload a local file to the existing R2 bucket `public`. Return the public URL. Copy it to the clipboard.

Wrangler is already installed globally (`bun add -g wrangler`) and already authenticated (`wrangler login`). Bucket `public` already exists. Custom domain `assets.shahram.dev` is already attached. Do not log in, create a bucket, or attach a domain.

## Steps

1. Resolve the local file to an absolute path. Confirm it exists.
   Done when: the path is absolute and the file is on disk.

2. Build the object key from a 24-byte hex prefix plus the original extension:
   `$(openssl rand -hex 24).${EXT}`
   Done when: key is `{48-hex-chars}.{ext}` with no original basename.

3. PUT to the live bucket (Wrangler v4 is local unless `--remote`):

```bash
wrangler r2 object put public/$(openssl rand -hex 24).avif --file=/Users/<user>/logo.avif --remote
```

   Substitute the generated key and the real `--file=` path. Keep bucket `public`.
   Done when: wrangler reports the object was uploaded remotely.

4. Public URL is `https://assets.shahram.dev/<key>`.
   `public/` is the bucket name, not a URL prefix. Do not add `/public/` to the path.

5. Copy the full URL to the clipboard, then reply with that same URL.

```bash
printf '%s' "https://assets.shahram.dev/${KEY}" | pbcopy
```

   Done when: clipboard has the exact URL and the reply includes it.

## Rules

- Always `--remote`.
- Always `--file=` with an absolute path.
- Always copy the URL with `pbcopy`.
- One file per run unless asked otherwise.
- Do not use `r2.dev`, workers, AWS CLI, or curl against the S3 API.
- Do not reuse object keys. Always `openssl rand -hex 24`.

## Examples

### Good

User: give me a public link for `/Users/<user>/logo.avif`

```bash
FILE="/Users/<user>/logo.avif"
EXT="${FILE##*.}"
KEY="$(openssl rand -hex 24).${EXT}"
wrangler r2 object put "public/${KEY}" --file="$FILE" --remote
URL="https://assets.shahram.dev/${KEY}"
printf '%s' "$URL" | pbcopy
echo "$URL"
```

Reply: `https://assets.shahram.dev/a1b2c3d4e5f6789012345678901234567890abcd.avif`

PUT shape (extension follows the source file):

```bash
wrangler r2 object put public/$(openssl rand -hex 24).avif --file=/Users/<user>/logo.avif --remote
```

### Bad

```bash
# local only — never appears on assets.shahram.dev
wrangler r2 object put public/$(openssl rand -hex 24).avif --file=/Users/<user>/logo.avif
```

```bash
# original filename as key — collisions + leaks the local name
wrangler r2 object put public/logo.avif --file=/Users/<user>/logo.avif --remote
```

```bash
# /public/ is not a URL path; this 404s
# uploaded key: abc.avif
# wrong URL: https://assets.shahram.dev/public/abc.avif
```

```bash
# nested key under the bucket name
wrangler r2 object put public/public/$(openssl rand -hex 24).avif --file=/Users/<user>/logo.avif --remote
```

```bash
# r2.dev instead of the attached custom domain
https://pub-xxxxx.r2.dev/abc.avif
```
