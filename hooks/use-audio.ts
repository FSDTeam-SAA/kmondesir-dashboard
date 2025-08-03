import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { audioAPI } from "@/lib/api"
import type { AudioResponse, SingleAudioResponse, AudioFormData } from "@/types/api"
import { toast } from "sonner"

export const useAudios = () => {
  return useQuery<AudioResponse>({
    queryKey: ["audios"],
    queryFn: () => audioAPI.getAll().then((res) => res.data),
  })
}

export const useAudio = (id: string) => {
  return useQuery<SingleAudioResponse>({
    queryKey: ["audio", id],
    queryFn: () => audioAPI.getById(id).then((res) => res.data),
    enabled: !!id,
  })
}

export const useCreateAudio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AudioFormData) => {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("subject", data.subject)
      formData.append("language", data.language)
      formData.append("description", data.description)
      formData.append("author", data.author)
      formData.append("about", data.about)
      formData.append("category", data.category)
      formData.append("tags", JSON.stringify(data.tags))
      formData.append("chapter", JSON.stringify(data.chapters))

      if (data.audioFile) {
        formData.append("audio", data.audioFile)
      }
      if (data.coverImage) {
        formData.append("coverImage", data.coverImage)
      }

      return audioAPI.upload(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audios"] })
      toast.success("Audio content created successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create audio content")
    },
  })
}

export const useUpdateAudio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AudioFormData }) => {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("subject", data.subject)
      formData.append("language", data.language)
      formData.append("description", data.description)
      formData.append("author", data.author)
      formData.append("about", data.about)
      formData.append("category", data.category)
      formData.append("tags", JSON.stringify(data.tags))
      formData.append("chapter", JSON.stringify(data.chapters))

      if (data.audioFile) {
        formData.append("audio", data.audioFile)
      }
      if (data.coverImage) {
        formData.append("coverImage", data.coverImage)
      }

      return audioAPI.update(id, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audios"] })
      toast.success("Audio content updated successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update audio content")
    },
  })
}

export const useDeleteAudio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => audioAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audios"] })
      toast.success("Audio content deleted successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete audio content")
    },
  })
}
