# API Update: Audio Endpoint Optimization

**Date:** December 4, 2025
**Endpoint:** `GET /api/audio/[id]`

## Summary
We have optimized the audio delivery endpoint to improve performance and reliability. The API now **redirects** requests directly to our global content delivery network (R2) instead of proxying the audio stream through our servers.

## Changes
- **Before:** The API fetched the audio file and streamed it to the client (Status 200).
- **After:** The API returns a Temporary Redirect (Status 307) to the direct storage URL.

## Benefits
- **Reduced Latency:** Audio starts playing almost instantly.
- **Improved Seeking:** Native support for `Range` headers allows for smoother seeking in audio players.
- **Reliability:** Eliminates timeouts for longer audio files.

## Action Required
- **No action required** for standard browsers and audio players (they handle redirects automatically).
- If you are using a custom HTTP client (e.g., `curl`, Python `requests`), ensure it is configured to **follow redirects** (`-L` in curl, `allow_redirects=True` in Python).
