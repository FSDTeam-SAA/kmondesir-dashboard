// Category/Genre types
export interface Category {
  _id: string
  name: string
  description: string
  about: string
  slug: string
  image?: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CategoryResponse {
  success: boolean
  message: string
  data: Category[]
}

export interface SingleCategoryResponse {
  success: boolean
  message: string
  data: Category
}

// Audio/Content types
export interface Chapter {
  _id: string
  title: string
  start: string
  end: string
}

export interface Audio {
  _id: string
  title: string
  subject: string
  language: string
  filePath: string
  coverImage: string
  listeners: number
  duration: number
  description: string
  tags: string[]
  author: string
  about: string
  category: string
  chapter: Chapter[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface AudioResponse {
  success: boolean
  message: string
  data: {
    audios: Audio[]
  }
}

export interface SingleAudioResponse {
  success: boolean
  message: string
  data: Audio
}

// Subscription types
export interface Subscription {
  _id: string
  planName: string
  price: number
  planValid: boolean
  feature: string[]
  __v: number
}

export interface SubscriptionResponse {
  success: boolean
  message: string
  data: Subscription[]
}

export interface SingleSubscriptionResponse {
  success: boolean
  message: string
  data: Subscription
}

// Form data types
export interface CategoryFormData {
  name: string
  description: string
  about: string
  slug: string
  image?: File
}

export interface AudioFormData {
  title: string
  subject: string
  language: string
  description: string
  tags: string[]
  author: string
  about: string
  category: string
  chapters: {
    title: string
    start: string
    end: string
  }[]
  audioFile?: File
  coverImage?: File
}

export interface SubscriptionFormData {
  planName: string
  price: number
  planValid: boolean
  feature: string[]
}
