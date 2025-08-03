"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"
import { useAudios, useDeleteAudio } from "@/hooks/use-audio"
import { useCategories } from "@/hooks/use-categories"

export default function ContentPage() {
  const { data: audiosData, isLoading, error } = useAudios()
  const { data: categoriesData } = useCategories()
  const deleteAudioMutation = useDeleteAudio()

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      await deleteAudioMutation.mutateAsync(id)
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categoriesData?.data?.find((cat) => cat._id === categoryId)
    return category?.name || "Unknown"
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-400">Error loading content: {error.message}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Content</h1>
            <p className="text-gray-400">Dashboard &gt; Content</p>
          </div>
          <Link href="/content/create">
            <Button className="bg-[#C5A46D] hover:bg-[#B8956A] text-white">
              Create Content <Plus className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-[#334155] rounded-lg border border-gray-600">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-600">
                <TableHead className="text-gray-300">Audio</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Listeners</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index} className="border-gray-600">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-[60px] h-[60px] rounded-lg bg-gray-600" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px] bg-gray-600" />
                            <Skeleton className="h-3 w-[300px] bg-gray-600" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px] bg-gray-600" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px] bg-gray-600" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px] bg-gray-600" />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-8 bg-gray-600" />
                          <Skeleton className="h-8 w-8 bg-gray-600" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : audiosData?.data?.audios?.map((content) => (
                    <TableRow key={content._id} className="border-gray-600">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Image
                            src={content.coverImage || "/placeholder.svg?height=60&width=60"}
                            alt={content.title}
                            width={60}
                            height={60}
                            className="rounded-lg"
                          />
                          <div>
                            <div className="text-white font-medium">{content.title}</div>
                            <div className="text-gray-400 text-sm max-w-xs truncate">{content.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{getCategoryName(content.category)}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-300">{content.listeners.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/content/edit/${content._id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                            onClick={() => handleDelete(content._id)}
                            disabled={deleteAudioMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">Showing {audiosData?.data?.audios?.length || 0} results</p>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              {"<"}
            </Button>
            <Button size="sm" className="bg-[#C5A46D] text-white">
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              {">"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
