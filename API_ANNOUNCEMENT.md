# 📢 API Update: Audio Streaming & Seek Support

We have released a new update to the Hindi Story API to improve audio playback capabilities.

## 🚀 What's New
We have added a new endpoint **`/api/audio/[id]`** that supports **HTTP Range Requests**.

## 💡 Why this matters
Previously, audio files were served directly from storage, which sometimes caused issues with seeking (scrubbing) in certain audio players.
With this new endpoint, your application can now:
- **Seek/Scrub** to any part of the audio track instantly.
- **Save Bandwidth** by downloading only the parts of the audio the user listens to.
- **Improve Performance** for longer audio stories.

## 🛠️ How to Upgrade
To enable seeking in your app, update your audio source URLs to use the new endpoint.

**Old Way (Direct Link):**
```json
{
  "audio_link": "https://pub-....r2.dev/..."
}
```

**New Way (Stream Endpoint):**
```
https://hindi-story.vercel.app/api/audio/{story_id}
```

### Example Usage
If you have a story with ID `1481748614`:

```javascript
// Construct the new audio URL
const audioUrl = `https://hindi-story.vercel.app/api/audio/1481748614`;

// Use this URL in your audio player
<audio src={audioUrl} controls />
```

The existing `audio_link` in the story object will continue to work, but for the best experience, we recommend constructing the URL using the story `id` and the new endpoint.

---
*If you have any questions, please reach out to the dev team.*
