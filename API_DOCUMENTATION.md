# Hindi Story Audiobook API Documentation

## Base URL
```
http://localhost:3000/api
```

For production:
```
https://hindi-story.vercel.app/api
```

---

## Authentication
Currently, the API is **publicly accessible** and does not require authentication.

---

## Endpoints

### 1. Get All Stories

Retrieve a list of all available Hindi stories.

**Endpoint:** `GET /api/stories`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Search query to filter stories by title, description, or keywords |
| `limit` | number | No | Maximum number of results to return |
| `offset` | number | No | Number of results to skip (for pagination). Default: `0` |

**Example Requests:**

```bash
# Get all stories
curl http://localhost:3000/api/stories

# Search for stories containing "ससुराल"
curl http://localhost:3000/api/stories?q=ससुराल

# Get first 2 stories
curl http://localhost:3000/api/stories?limit=2

# Get stories with pagination (skip first 2, get next 2)
curl http://localhost:3000/api/stories?offset=2&limit=2
```

**Response Format:**

```json
{
  "success": true,
  "count": 4,
  "query": "ससुराल",
  "data": [
    {
      "title": "200 साल का ससुराल",
      "audio_link": "https://pub-141831e61e69445289222976a15b6fb3.r2.dev/API Audio/1764803665_temp_audio_1764803026.mp3",
      "thumbnail": "https://pub-141831e61e69445289222976a15b6fb3.r2.dev/images/1764803671_gen_img_1764803665.webp",
      "description": "200 साल का ससुराल\" क्या है इस अनोखे रिश्ते की कहानी?...",
      "keywords": ["ससुराल", "200 साल", "रिश्ता", "परिवार", "परंपरा"],
      "status": "success",
      "processed_at": "2025-12-04 04:44:34",
      "id": 1265849516
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the request was successful |
| `count` | number | Total number of stories matching the query |
| `query` | string | (Optional) The search query used, if any |
| `data` | array | Array of story objects |

**Story Object Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier for the story (generated from title + audio_link hash) |
| `title` | string | Story title in Hindi |
| `audio_link` | string | Direct URL to the audio file (MP3) |
| `thumbnail` | string | URL to the story thumbnail image (WebP) |
| `description` | string | Story description in Hindi |
| `keywords` | string[] | Array of keywords/tags for the story |
| `status` | string | Processing status (typically "success") |
| `processed_at` | string | Timestamp when the story was processed |

**Error Response:**

```json
{
  "success": false,
  "error": "Failed to fetch stories",
  "code": "FETCH_ERROR"
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### 2. Stream Audio (Range Request Support)

Stream audio for a specific story with support for seeking (HTTP Range requests).

**Endpoint:** `GET /api/audio/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Unique story identifier |

**Headers:**
- Supports `Range` header for seeking.

**Response:**
- Returns audio stream (audio/mpeg).
- Status: `200 OK` or `206 Partial Content`.

**Example:**
```bash
curl -I -H "Range: bytes=0-100" http://localhost:3000/api/audio/988693911
```

---

### 3. Get Story by ID

Retrieve a single story by its unique ID.

**Endpoint:** `GET /api/stories/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Unique story identifier |

**Example Requests:**

```bash
# Get story with ID 988693911
curl http://localhost:3000/api/stories/988693911

# Using JavaScript fetch
fetch('http://localhost:3000/api/stories/988693911')
  .then(res => res.json())
  .then(data => console.log(data))
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "title": "सर्दी की ठंडी बहू: एक नैतिक कहानी",
    "audio_link": "https://pub-141831e61e69445289222976a15b6fb3.r2.dev/API Audio/1764803618_temp_audio_1764803588.mp3",
    "thumbnail": "https://pub-141831e61e69445289222976a15b6fb3.r2.dev/images/1764803626_gen_img_1764803618.webp",
    "description": "सर्दी की ठंडी बहू\" एक मार्मिक कहानी है...",
    "keywords": ["नैतिक कहानी", "ठंडी बहू", "सर्दी", "बहू", "नैतिक"],
    "status": "success",
    "processed_at": "2025-12-04 04:43:49",
    "id": 988693911
  }
}
```

**Error Responses:**

Invalid ID:
```json
{
  "success": false,
  "error": "Invalid story ID",
  "code": "INVALID_ID"
}
```

Story Not Found:
```json
{
  "success": false,
  "error": "Story not found",
  "code": "NOT_FOUND"
}
```

Server Error:
```json
{
  "success": false,
  "error": "Failed to fetch story",
  "code": "FETCH_ERROR"
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid ID format
- `404 Not Found` - Story not found
- `500 Internal Server Error` - Server error

---

## CORS Configuration

All endpoints support **Cross-Origin Resource Sharing (CORS)** with the following headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

This allows the API to be accessed from any domain.

---

## Available Story IDs

Current stories in the database:

| ID | Title |
|----|-------|
| `988693911` | सर्दी की ठंडी बहू: एक नैतिक कहानी |
| `1265849516` | 200 साल का ससुराल |
| `1565605992` | मायका टूटे पर ससुराल ना टूटे |
| `587561938` | चूल्हे पर दस पकवान |

---

## Code Examples

### JavaScript/TypeScript

```typescript
// Fetch all stories
async function getAllStories() {
  const response = await fetch('http://localhost:3000/api/stories')
  const data = await response.json()
  
  if (data.success) {
    console.log(`Found ${data.count} stories`)
    return data.data
  } else {
    console.error('Error:', data.error)
  }
}

// Search stories
async function searchStories(query: string) {
  const response = await fetch(`http://localhost:3000/api/stories?q=${encodeURIComponent(query)}`)
  const data = await response.json()
  return data.data
}

// Get single story
async function getStory(id: number) {
  const response = await fetch(`http://localhost:3000/api/stories/${id}`)
  const data = await response.json()
  
  if (data.success) {
    return data.data
  } else {
    throw new Error(data.error)
  }
}

// Usage
getAllStories()
searchStories('ससुराल')
getStory(988693911)
```

### Python

```python
import requests

BASE_URL = "http://localhost:3000/api"

# Get all stories
def get_all_stories():
    response = requests.get(f"{BASE_URL}/stories")
    data = response.json()
    
    if data['success']:
        print(f"Found {data['count']} stories")
        return data['data']
    else:
        print(f"Error: {data['error']}")

# Search stories
def search_stories(query):
    response = requests.get(f"{BASE_URL}/stories", params={'q': query})
    return response.json()['data']

# Get single story
def get_story(story_id):
    response = requests.get(f"{BASE_URL}/stories/{story_id}")
    data = response.json()
    
    if data['success']:
        return data['data']
    else:
        raise Exception(data['error'])

# Usage
stories = get_all_stories()
search_results = search_stories('ससुराल')
story = get_story(988693911)
```

### cURL

```bash
# Get all stories
curl -X GET http://localhost:3000/api/stories

# Search stories
curl -X GET "http://localhost:3000/api/stories?q=ससुराल"

# Get story by ID
curl -X GET http://localhost:3000/api/stories/988693911

# With pagination
curl -X GET "http://localhost:3000/api/stories?limit=2&offset=0"

# Pretty print JSON response
curl -X GET http://localhost:3000/api/stories | jq '.'
```

---

## Rate Limiting

Currently, there are **no rate limits** implemented. However, please use the API responsibly.

---

## Data Source

Stories are loaded from the local JSON file: `content/stories.json`

The API uses a caching mechanism to improve performance. Story IDs are generated using a stable hash function based on the story's title and audio link.

---

## TypeScript Types

If you're using TypeScript, here are the type definitions:

```typescript
interface StoryWithId {
  id: number
  title: string
  audio_link: string
  thumbnail: string
  description: string
  keywords: string[]
  status: string
  processed_at: string
}

interface StoriesListResponse {
  success: true
  count: number
  query?: string
  data: StoryWithId[]
}

interface StoryDetailResponse {
  success: true
  data: StoryWithId
}

interface ApiErrorResponse {
  success: false
  error: string
  code: string
}
```

---

## Support

For issues or questions, please contact the development team or open an issue in the project repository.

---

**Last Updated:** December 4, 2025
