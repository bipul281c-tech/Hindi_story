export interface Story {
  title: string
  audio_link: string
  thumbnail: string
  description: string
  keywords?: string[]
}

export interface StoryWithId extends Story {
  id: number
}

export interface StoriesListResponse {
  success: boolean
  count: number
  query?: string
  data: StoryWithId[]
}

export interface StoryDetailResponse {
  success: boolean
  data: StoryWithId
}

export interface ApiErrorResponse {
  success: false
  error: string
  code: string
}
