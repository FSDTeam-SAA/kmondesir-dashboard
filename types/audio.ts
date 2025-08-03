export interface AudioChapter {
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
  filePath: string // This will be the URL from the server
  about: string
  author: string
  category: string
  chapter: AudioChapter[]
  coverImage: string // This will be the URL from the server
  createdAt: string
  description: string
  duration: number
  listeners: number
  tags: string[]
  updatedAt: string
  __v: number
}

// Data structure for creating audio, including optional File objects for upload
export interface CreateAudioData {
  title: string
  subject: string
  language: string
  about: string
  author: string
  category: string
  description: string
  tags: string[]
  chapter: Omit<AudioChapter, "_id">[]
  // These are for actual file uploads
  audioFile?: File
  coverImageFile?: File
  // These are for existing URLs or client-side previews
  filePath?: string
  coverImage?: string
}

// Data structure for updating audio, including optional File objects for upload
export interface UpdateAudioData extends Partial<CreateAudioData> {
  _id: string
}

export interface AudioMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AudioListResponse {
  audios: Audio[]
  meta: AudioMeta
}
