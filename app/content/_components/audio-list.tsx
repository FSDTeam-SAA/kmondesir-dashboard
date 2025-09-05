// components/audio-list.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DeleteAudioModal } from "./delete-audio-modal";
import type { Audio } from "@/types/audio";
import { useAudioList } from "@/hooks/use-audio";

interface AudioListProps {
  onEdit: (audio: Audio) => void;
  onCreateNew: () => void;
}

const ALL_SUBJECT_VALUE = "__ALL_SUBJECT__";
const ALL_CATEGORY_VALUE = "__ALL_CATEGORY__";

export function AudioList({ onEdit, onCreateNew }: AudioListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filters
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  // reset page on filter change
  useEffect(() => setCurrentPage(1), [debouncedQ, subject, category]);

  const { data, isLoading, error, isFetching } = useAudioList(
    currentPage,
    itemsPerPage,
    {
      q: debouncedQ || undefined,
      subject: subject || undefined,
      category: category || undefined,
    }
  );

  const audioList = data?.audios || [];
  const meta = data?.meta || {
    total: 0,
    page: currentPage,
    limit: itemsPerPage,
    totalPages: 0,
  };

  // Build small local dropdown options from current results
  const subjectOptions = useMemo(() => {
    const s = new Set<string>();
    audioList.forEach((a) => a.subject && s.add(a.subject));
    return Array.from(s).sort();
  }, [audioList]);

  const categoryOptions = useMemo(() => {
    const m = new Map<string, string>();
    audioList.forEach((a: any) => {
      if (!a?.category) return;
      if (typeof a.category === "string") m.set(a.category, a.category);
      else if (a.category?._id)
        m.set(a.category._id, a.category?.name || a.category._id);
    });
    return Array.from(m.entries()); // [id, label]
  }, [audioList]);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    audio: Audio | null;
  }>({ open: false, audio: null });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const handleDelete = (audio: Audio) => setDeleteModal({ open: true, audio });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= meta.totalPages) setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons: (number | "...")[] = [];
    const maxButtons = 5;
    if (meta.totalPages <= maxButtons) {
      for (let i = 1; i <= meta.totalPages; i++) buttons.push(i);
    } else {
      buttons.push(1);
      let start = Math.max(2, currentPage - Math.floor(maxButtons / 2) + 1);
      let end = Math.min(
        meta.totalPages - 1,
        currentPage + Math.floor(maxButtons / 2) - 1
      );

      if (currentPage <= Math.floor(maxButtons / 2) + 1) {
        end = maxButtons - 1;
      } else if (currentPage >= meta.totalPages - Math.floor(maxButtons / 2)) {
        start = meta.totalPages - maxButtons + 2;
      }

      if (start > 2) buttons.push("...");
      for (let i = start; i <= end; i++) buttons.push(i);
      if (end < meta.totalPages - 1) buttons.push("...");
      buttons.push(meta.totalPages);
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
      )
    );
  };

  const renderSkeletonRows = () =>
    Array.from({ length: itemsPerPage }).map((_, index) => (
      <div
        key={index}
        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-750"
      >
        <div className="col-span-4 flex items-center gap-3">
          <Skeleton className="w-[120px] h-[80px] rounded bg-slate-700" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px] bg-slate-700" />
            <Skeleton className="h-3 w-[200px] bg-slate-700" />
            <Skeleton className="h-3 w-[180px] bg-slate-700" />
          </div>
        </div>
        <div className="col-span-2">
          <Skeleton className="h-4 w-[100px] bg-slate-700" />
        </div>
        <div className="col-span-2">
          <Skeleton className="h-4 w-[80px] bg-slate-700" />
        </div>
        <div className="col-span-2">
          <Skeleton className="h-4 w-[60px] bg-slate-700" />
        </div>
        <div className="col-span-2 flex gap-2">
          <Skeleton className="h-8 w-8 bg-slate-700" />
          <Skeleton className="h-8 w-8 bg-slate-700" />
        </div>
      </div>
    ));

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">
            Error loading audio list: {(error as any)?.message || String(error)}
          </div>
        </div>
      </div>
    );
  }

  const startIndex = (meta.page - 1) * meta.limit + 1;
  const endIndex = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="bg-slate-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Audio Management</h1>
        <Button
          onClick={onCreateNew}
          className="bg-[#C5A46D] hover:bg-[#B8956A] text-black hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="md:col-span-5">
            <div className="relative">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title..."
                className="pr-10 bg-slate-900/60 border-slate-700 text-slate-100 placeholder:text-slate-400"
              />
              {isFetching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin">
                  ⏳
                </span>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="md:col-span-3">
            <Select
              value={subject ?? ALL_SUBJECT_VALUE}
              onValueChange={(v) =>
                setSubject(v === ALL_SUBJECT_VALUE ? undefined : v)
              }
            >
              <SelectTrigger className="bg-slate-900/60 border-slate-700 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectItem value={ALL_SUBJECT_VALUE}>All subjects</SelectItem>
                {subjectOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="md:col-span-3">
            <Select
              value={category ?? ALL_CATEGORY_VALUE}
              onValueChange={(v) =>
                setCategory(v === ALL_CATEGORY_VALUE ? undefined : v)
              }
            >
              <SelectTrigger className="bg-slate-900/60 border-slate-700 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectItem value={ALL_CATEGORY_VALUE}>
                  All categories
                </SelectItem>
                {categoryOptions.map(([id, label]) => (
                  <SelectItem key={id} value={id}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset */}
          <div className="md:col-span-1 flex gap-2 md:justify-end">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-700"
              onClick={() => {
                setQ("");
                setSubject(undefined);
                setCategory(undefined);
              }}
            >
              <X className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
        </div>

        {/* Active filter chips */}
        <div className="mt-2 flex flex-wrap gap-2">
          {debouncedQ && (
            <Badge className="bg-slate-700 text-slate-200">
              search: "{debouncedQ}"
            </Badge>
          )}
          {subject && (
            <Badge className="bg-slate-700 text-slate-200">
              subject: {subject}
            </Badge>
          )}
          {category && (
            <Badge className="bg-slate-700 text-slate-200">
              category:{" "}
              {categoryOptions.find(([id]) => id === category)?.[1] || category}
            </Badge>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-700 text-white font-medium">
          <div className="col-span-4">Video</div>
          <div className="col-span-2">Genres</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Listeners</div>
          <div className="col-span-2">Actions</div>
        </div>

        <div className="divide-y divide-slate-700">
          {isLoading ? (
            renderSkeletonRows()
          ) : audioList.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No audio content found. Try adjusting your filters.
            </div>
          ) : (
            audioList.map((audio) => (
              <div
                key={audio._id}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-750"
              >
                {/* Video Info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="flex w-[120px] h-[80px] rounded overflow-hidden bg-slate-700">
                    {audio.coverImage ? (
                      <Image
                        src={audio.coverImage || "/placeholder.svg"}
                        alt={audio.title}
                        width={500}
                        height={500}
                        className="object-cover w-[120px] h-[80px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {audio.title?.charAt(0) || "A"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium line-clamp-1">
                      {audio.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {audio.description}
                    </p>
                  </div>
                </div>

                {/* Genres (subject) */}
                <div className="col-span-2">
                  <span className="text-slate-300">
                    {(audio as any).subject || "—"}
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <span className="text-slate-300">
                    {formatDate((audio as any).createdAt)}
                  </span>
                </div>

                {/* Listeners */}
                <div className="col-span-2">
                  <span className="text-slate-300">
                    {(audio as any).listeners?.toLocaleString?.() || "0"}
                  </span>
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-700">
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
  );
}
