"use client";

import type React from "react";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks/use-categories";
import type { CategoryFormData, Category } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { EditCategoryModal } from "@/components/modals/edit-category-modal";

export default function GenresPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteGenreId, setDeleteGenreId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    about: "",
    slug: "",
    image: undefined,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const itemsPerPage = 10; // Constant for items per page

  const { data: categoriesData, isLoading, error } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategoryMutation.mutateAsync(formData);
    setIsCreateOpen(false);
    setFormData({
      name: "",
      description: "",
      about: "",
      slug: "",
      image: undefined,
    });
    setCurrentPage(1); // Reset to first page after creating a new genre
  };

  const handleDelete = (id: string) => {
    setDeleteGenreId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteGenreId) {
      await deleteCategoryMutation.mutateAsync(deleteGenreId);
      setIsDeleteOpen(false);
      setDeleteGenreId(null);
      // Adjust current page if necessary after deletion
      const totalItems = categoriesData?.data?.length || 0;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (totalItems === 0) {
        setCurrentPage(1);
      }
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  // Pagination logic
  const totalItems = categoriesData?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGenres = categoriesData?.data?.slice(startIndex, endIndex) || [];

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-400">
          Error loading genres: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header and Create Modal unchanged */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Genres</h1>
            <p className="text-gray-400">Dashboard &gt; Genres</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#C5A46D] hover:bg-[#B8956A] text-black hover:text-white">
                Create Genres <Plus className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#334155] border-gray-600 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Create Genre</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Name</Label>
                  <Input
                    placeholder="Genre name..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-[#2A3441] border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea
                    placeholder="Genre description..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-[#2A3441] border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">About</Label>
                  <Textarea
                    placeholder="About this genre..."
                    value={formData.about}
                    onChange={(e) =>
                      setFormData({ ...formData, about: e.target.value })
                    }
                    className="bg-[#2A3441] border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Slug</Label>
                  <Input
                    placeholder="genre-slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="bg-[#2A3441] border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-[#2A3441] border-gray-600 text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    className="border-gray-600 text-black hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#C5A46D] hover:bg-[#B8956A] text-white"
                    disabled={createCategoryMutation.isPending}
                  >
                    {createCategoryMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="bg-[#334155] rounded-lg border border-gray-600">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-600">
                <TableHead className="text-gray-300">Genre Name</TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300">Added</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-gray-600">
                    <TableCell className="flex items-center space-x-3">
                      <Skeleton className="w-[60px] h-[60px] rounded-lg bg-gray-600" />
                      <Skeleton className="h-4 w-[200px] bg-gray-600" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px] bg-gray-600" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px] bg-gray-600" />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-8 bg-gray-600" />
                        <Skeleton className="h-8 w-8 bg-gray-600" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                paginatedGenres.map((genre) => (
                  <TableRow key={genre._id} className="border-gray-600">
                    <TableCell className="flex items-center space-x-3">
                      <Image
                        src={genre.image || "/placeholder.png"}
                        alt={genre.name}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <span className="text-white font-medium">
                        {genre.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-xs truncate">
                      {genre.description}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(genre.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={() => handleEdit(genre)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                          onClick={() => handleDelete(genre._id)}
                          disabled={deleteCategoryMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="bg-[#334155] border-gray-600 text-white max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription className="text-gray-300">
                Are you sure you want to delete this genre? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteGenreId(null);
                }}
                className="border-gray-600 text-black hover:bg-gray-700"
              >
                No
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={deleteCategoryMutation.isPending}
              >
                {deleteCategoryMutation.isPending ? "Deleting..." : "Yes"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        {totalItems > itemsPerPage && (
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {startIndex + 1} - {Math.min(endIndex, totalItems)} of {totalItems} results
            </p>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent hover:text-white"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                &lt;
              </Button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  className={
                    currentPage === page
                      ? "bg-[#C5A46D] text-white"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent hover:text-white"
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent hover:text-white"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                &gt;
              </Button>
            </div>
          </div>
        )}
      </div>
      <EditCategoryModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        category={selectedCategory}
      />
    </DashboardLayout>
  );
}