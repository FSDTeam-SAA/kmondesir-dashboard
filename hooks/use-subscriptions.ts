import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { subscriptionAPI } from "@/lib/api"
import type { SubscriptionResponse, SingleSubscriptionResponse, SubscriptionFormData } from "@/types/api"
import { toast } from "sonner"

export const useSubscriptions = () => {
  return useQuery<SubscriptionResponse>({
    queryKey: ["subscriptions"],
    queryFn: () => subscriptionAPI.getAll().then((res) => res.data),
  })
}

export const useSubscription = (id: string) => {
  return useQuery<SingleSubscriptionResponse>({
    queryKey: ["subscription", id],
    queryFn: () => subscriptionAPI.getById(id).then((res) => res.data),
    enabled: !!id,
  })
}

export const useCreateSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SubscriptionFormData) => subscriptionAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
      toast.success("Subscription created successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create subscription")
    },
  })
}

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubscriptionFormData }) => subscriptionAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
      toast.success("Subscription updated successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update subscription")
    },
  })
}

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subscriptionAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
      toast.success("Subscription deleted successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete subscription")
    },
  })
}
