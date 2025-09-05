// lib/api/audio.ts
import type {
  Audio,
  CreateAudioData,
  UpdateAudioData,
  AudioListResponse,
} from "@/types/audio";

type ListParams = {
  q?: string;
  subject?: string;
  category?: string;
};

export const audioApi = {
  // Get all audio with pagination + filters
  getAll: async (
    page = 1,
    limit = 10,
    params: ListParams = {}
  ): Promise<AudioListResponse> => {
    const search = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (params.q) search.set("q", params.q);
    if (params.subject) search.set("subject", params.subject);
    if (params.category) search.set("category", params.category);

    const url = `${
      process.env.NEXT_PUBLIC_BACKEND_API
    }/audio/all-audio?${search.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("audioApi.getAll failed:", response.status, text);
      throw new Error("Failed to fetch audio");
    }
    const data = await response.json();

    // Expecting { success: true, message: '...', data: { audios: [], meta: {} } }
    if (data?.data && Array.isArray(data.data.audios) && data.data.meta) {
      return {
        audios: data.data.audios,
        meta: data.data.meta,
      };
    } else {
      console.error("Unexpected API response structure for getAll:", data);
      return {
        audios: Array.isArray(data) ? data : [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };
    }
  },

  // Get single audio by ID
  getById: async (id: string): Promise<Audio> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/audio/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch audio");
    }
    return response.json();
  },

  // Helper to build FormData
  buildFormData: (data: CreateAudioData | UpdateAudioData) => {
    const formData = new FormData();
    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      const value = (data as any)[key];
      if (key === "audioFile" && value instanceof File) {
        formData.append("audio", value);
      } else if (key === "coverImageFile" && value instanceof File) {
        formData.append("coverImage", value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (
        value !== undefined &&
        value !== null &&
        !(value instanceof File)
      ) {
        if (
          key !== "audioFile" &&
          key !== "coverImageFile" &&
          key !== "filePath" &&
          key !== "coverImage"
        ) {
          formData.append(key, String(value));
        }
      }
    }
    return formData;
  },

  // Create new audio
  create: async (data: CreateAudioData): Promise<Audio> => {
    const formData = audioApi.buildFormData(data);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/audio/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create audio");
    }
    return response.json();
  },

  // Update audio
  update: async (data: UpdateAudioData): Promise<Audio> => {
    const formData = audioApi.buildFormData(data);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/audio/${data._id}/update`,
      {
        method: "PATCH",
        body: formData,
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update audio");
    }
    return response.json();
  },

  // Delete audio
  delete: async (id: string): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/audio/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete audio");
    }
  },
};
