"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCategory } from "@/hooks/use-categories";
import type { Category, CategoryFormData } from "@/types/api";
import Image from "next/image";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function EditCategoryModal({ open, onOpenChange, category }: EditCategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    about: "",
    slug: "",
    image: undefined,
  });
  const [fileName, setFileName] = useState<string | null>(null); // Track selected file name
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Track image preview URL

  const updateCategoryMutation = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        about: category.about,
        slug: category.slug,
        image: undefined,
      });
      setFileName(null);
      setImagePreview(category.image || null); // Set initial preview to category image
    }
    // Cleanup preview URL when modal closes or category changes
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    await updateCategoryMutation.mutateAsync({ id: category._id, data: formData });
    onOpenChange(false);
    // Cleanup preview URL after submission
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFileName(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setFileName(file.name);
      // Generate a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setFormData({ ...formData, image: undefined });
      setFileName(null);
      setImagePreview(category?.image || null); // Revert to previous image
    }
  };

  const handleClearImage = () => {
    setFormData({ ...formData, image: undefined });
    setFileName(null);
    setImagePreview(category?.image || null); // Revert to previous image
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // Extract image name from category.image (imageLink) or fileName
  const getImageName = () => {
    if (fileName) return fileName;
    if (category?.image) {
      // Extract the file name from the URL (e.g., "https://example.com/path/image.jpg" -> "image.jpg")
      return category.image.split("/").pop() || "Current image";
    }
    return "No image selected";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          setFileName(null);
          setImagePreview(category?.image || null); // Revert to previous image
          if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
          }
        }
      }}
    >
      <DialogContent className="bg-[#334155] border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Genre</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-white">Name</Label>
            <Input
              placeholder="Genre name..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#2A3441] border-gray-600 text-white"
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-white">Description</Label>
            <Textarea
              placeholder="Genre description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#2A3441] border-gray-600 text-white"
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-white">About</Label>
            <Textarea
              placeholder="About this genre..."
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="bg-[#2A3441] border-gray-600 text-white"
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-white">Slug</Label>
            <Input
              placeholder="genre-slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="bg-[#2A3441] border-gray-600 text-white"
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-white">Image (optional)</Label>
            <div className="flex items-center space-x-2">
              <label
                className="flex-1 bg-[#2A3441] border border-gray-600 text-white text-sm rounded-md px-3 py-2 cursor-pointer hover:bg-[#3B4A5E] transition-colors"
              >
                <span>{fileName || "Choose File"}</span>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {(fileName || category?.image) && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onClick={handleClearImage}
                >
                  Clear
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Leave empty to keep current image</p>
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="Image preview"
                  width={120}
                  height={120}
                  className="rounded-lg border border-gray-600 object-cover"
                />
                <p className="text-sm text-white mt-1">Image: {getImageName()}</p>
              </div>
            )}
            {!imagePreview && (
              <p className="text-sm text-white mt-1">Image: {getImageName()}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setFileName(null);
                setImagePreview(category?.image || null); // Revert to previous image
                if (imagePreview && imagePreview.startsWith("blob:")) {
                  URL.revokeObjectURL(imagePreview);
                }
              }}
              className="border-gray-600 text-black hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C5A46D] hover:bg-[#B8956A] text-black"
              disabled={updateCategoryMutation.isPending}
            >
              {updateCategoryMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}