"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { DeleteAudioModal } from "./delete-audio-modal"
import type { Audio } from "@/types/audio"
import Image from "next/image"
import { useAudioList } from "@/hooks/use-audio"

interface AudioListProps {
  onEdit: (audio: Audio) => void
  onCreateNew: () => void
}

export function AudioList({ onEdit, onCreateNew }: AudioListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // This should match the default limit in useAudioList and API

  // FIX: Correctly declare deleteModal state
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; audio: Audio | null }>({
    open: false,
    audio: null,
  })

  const { data, isLoading, error } = useAudioList(currentPage, itemsPerPage)

  const audioList = data?.audios || []
  const meta = data?.meta || { total: 0, page: currentPage, limit: itemsPerPage, totalPages: 0 }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const handleDelete = (audio: Audio) => {
    setDeleteModal({ open: true, audio })
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= meta.totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxButtons = 5 // Max number of visible page buttons

    if (meta.totalPages <= maxButtons) {
      for (let i = 1; i <= meta.totalPages; i++) {
        buttons.push(i)
      }
    } else {
      // Always show first page
      buttons.push(1)

      // Logic for showing ellipsis and dynamic range
      let start = Math.max(2, currentPage - Math.floor(maxButtons / 2) + 1)
      let end = Math.min(meta.totalPages - 1, currentPage + Math.floor(maxButtons / 2) - 1)

      if (currentPage <= Math.floor(maxButtons / 2) + 1) {
        end = maxButtons - 1
      } else if (currentPage >= meta.totalPages - Math.floor(maxButtons / 2)) {
        start = meta.totalPages - maxButtons + 2
      }

      if (start > 2) {
        buttons.push("...")
      }

      for (let i = start; i <= end; i++) {
        buttons.push(i)
      }

      if (end < meta.totalPages - 1) {
        buttons.push("...")
      }

      // Always show last page
      buttons.push(meta.totalPages)
    }

    return buttons.map((pageNumber, index) =>
      pageNumber === "..." ? (
        <span key={`ellipsis-${index}`} className="text-slate-400 px-2">
          ...
        </span>
      ) : (
        <Button
          key={pageNumber}
          size="sm"
          variant={currentPage === pageNumber ? "default" : "ghost"}
          onClick={() => handlePageChange(pageNumber as number)}
          className={
            currentPage === pageNumber
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-600"
          }
        >
          {pageNumber}
        </Button>
      ),
    )
  }

  if (isLoading) {
    return (
      <div className="bg-slate-900 min-h-screen p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading audio list...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error loading audio list: {error.message}</div>
        </div>
      </div>
    )
  }

  const startIndex = (meta.page - 1) * meta.limit + 1
  const endIndex = Math.min(meta.page * meta.limit, meta.total)

  return (
    <div className="bg-slate-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Audio Management</h1>
        <Button onClick={onCreateNew} className="bg-[#C5A46D] hover:bg-[#B8956A] text-black hover:text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-700 text-white font-medium">
          <div className="col-span-4">Video</div>
          <div className="col-span-2">Genres</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Listeners</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-700">
          {audioList.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No audio content found. Create your first audio content to get started.
            </div>
          ) : (
            audioList.map((audio) => (
              <div key={audio._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-750">
                {/* Video Info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="flex">
                    {audio.coverImage ? (
                      <Image
                        src={audio.coverImage || "/placeholder.svg"}
                        alt={audio.title}
                        width={500}
                        height={500}
                        className="object-cover w-[120px] h-[80px] rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{audio.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{audio.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{audio.description}</p>
                  </div>
                </div>

                {/* Genres */}
                <div className="col-span-2">
                  <span className="text-slate-300">{audio.subject}</span>
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <span className="text-slate-300">{formatDate(audio.createdAt)}</span>
                </div>

                {/* Listeners */}
                <div className="col-span-2">
                  <span className="text-slate-300">{audio.listeners?.toLocaleString() || "0"}</span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(audio)}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(audio)}
                    className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {meta.total > 0 && (
          <div className="flex items-center justify-between p-4 bg-slate-700">
            <span className="text-slate-300 text-sm">
              Showing {startIndex} to {endIndex} of {meta.total} results
            </span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-slate-400 hover:text-white hover:bg-slate-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {renderPaginationButtons()}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === meta.totalPages}
                className="text-slate-400 hover:text-white hover:bg-slate-600"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteAudioModal
        audio={deleteModal.audio}
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, audio: null })}
      />
    </div>
  )
}
