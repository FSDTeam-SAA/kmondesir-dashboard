"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateCategory } from "@/hooks/use-categories"
import type { Category, CategoryFormData } from "@/types/api"

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
}

export function EditCategoryModal({ open, onOpenChange, category }: EditCategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    about: "",
    slug: "",
    image: undefined,
  })

  const updateCategoryMutation = useUpdateCategory()

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        about: category.about,
        slug: category.slug,
        image: undefined,
      })
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return

    await updateCategoryMutation.mutateAsync({ id: category._id, data: formData })
    onOpenChange(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#334155] border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Genre</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white">Name</Label>
            <Input
              placeholder="Genre name..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#2A3441] border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-white">Description</Label>
            <Textarea
              placeholder="Genre description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#2A3441] border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-white">About</Label>
            <Textarea
              placeholder="About this genre..."
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="bg-[#2A3441] border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-white">Slug</Label>
            <Input
              placeholder="genre-slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="bg-[#2A3441] border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-white">Image (optional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-[#2A3441] border-gray-600 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty to keep current image</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C5A46D] hover:bg-[#B8956A] text-white"
              disabled={updateCategoryMutation.isPending}
            >
              {updateCategoryMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
