import type { Audio, CreateAudioData, UpdateAudioData, AudioListResponse } from "@/types/audio"



export const audioApi = {
  // Get all audio with pagination
  getAll: async (page = 1, limit = 10): Promise<AudioListResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/audio/all-audio?page=${page}&limit=${limit}`)
    if (!response.ok) {
      throw new Error("Failed to fetch audio")
    }
    const data = await response.json()

    // Expecting { success: true, message: "...", data: { audios: [], meta: {} } }
    if (data.data && Array.isArray(data.data.audios) && data.data.meta) {
      return {
        audios: data.data.audios,
        meta: data.data.meta,
      }
    } else {
      console.error("Unexpected API response structure for getAll:", data)
      // Fallback to a default structure if the expected one is not found
      return {
        audios: Array.isArray(data) ? data : [], // Try to use data directly if it's an array
        meta: { total: 0, page: page, limit: limit, totalPages: 0 },
      }
    }
  },

  // Get single audio by ID
  getById: async (id: string): Promise<Audio> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/audio/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch audio")
    }
    return response.json()
  },

  // Helper to build FormData
  buildFormData: (data: CreateAudioData | UpdateAudioData) => {
    const formData = new FormData()

    // Append text fields
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = (data as any)[key]
        if (value instanceof File) {
          // Handle File objects separately
          if (key === "audioFile") formData.append("audio", value)
          if (key === "coverImageFile") formData.append("coverImage", value)
        } else if (Array.isArray(value)) {
          // Handle arrays (like chapters, tags) by stringifying them
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined && value !== null) {
          // Append other non-file, non-array fields
          formData.append(key, String(value))
        }
      }
    }
    return formData
  },

  // Create new audio
  create: async (data: CreateAudioData): Promise<Audio> => {
    const formData = audioApi.buildFormData(data)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/audio/upload`, {
      method: "POST",
      // Do NOT set Content-Type header for FormData, browser sets it automatically
      body: formData,
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create audio")
    }
    return response.json()
  },

  // Update audio
  update: async (data: UpdateAudioData): Promise<Audio> => {
    const formData = audioApi.buildFormData(data)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/audio/${data._id}/update`, {
      method: "PATCH",
      // Do NOT set Content-Type header for FormData, browser sets it automatically
      body: formData,
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update audio")
    }
    return response.json()
  },

  // Delete audio
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/audio/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete audio")
    }
  },
}
