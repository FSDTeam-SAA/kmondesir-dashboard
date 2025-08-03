import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryAPI } from "@/lib/api";
import type {
  CategoryResponse,
  SingleCategoryResponse,
  CategoryFormData,
} from "@/types/api";
import { toast } from "sonner";

export const useCategories = () => {
  return useQuery<CategoryResponse>({
    queryKey: ["categories"],
    queryFn: () => categoryAPI.getAll().then((res) => res.data),
  });
};

export const useCategory = (id: string) => {
  return useQuery<SingleCategoryResponse>({
    queryKey: ["category", id],
    queryFn: () => categoryAPI.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("about", data.about);
      formData.append("slug", data.slug);
      if (data.image) {
        formData.append("imageLink", data.image);
      }
      return categoryAPI.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("about", data.about);
      formData.append("slug", data.slug);
      if (data.image) {
        formData.append("imageLink", data.image);
      }
      return categoryAPI.update(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
};
