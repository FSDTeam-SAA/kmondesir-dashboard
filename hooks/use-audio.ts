import { audioApi } from "@/lib/audioApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ListParams = {
  q?: string;
  subject?: string;
  category?: string; // category _id (backend populates category)
};

export const useAudioList = (page = 1, limit = 10, params: ListParams = {}) => {
  return useQuery({
    queryKey: ["audio", { page, limit, ...params }],
    queryFn: () => audioApi.getAll(page, limit, params),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // smooth pagination
    placeholderData: (previousData) => previousData,
  });
};

export const useAudio = (id: string) => {
  return useQuery({
    queryKey: ["audio", id],
    queryFn: () => audioApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateAudio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: audioApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audio"] });
    },
    onError: (error) => {
      console.error("Failed to create audio:", error);
    },
  });
};

export const useUpdateAudio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: audioApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["audio"] });
      queryClient.invalidateQueries({ queryKey: ["audio", data._id] });
    },
    onError: (error) => {
      console.error("Failed to update audio:", error);
    },
  });
};

export const useDeleteAudio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: audioApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audio"] });
    },
    onError: (error) => {
      console.error("Failed to delete audio:", error);
    },
  });
};
