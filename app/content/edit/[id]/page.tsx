"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, Upload, X } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import { useAudio, useUpdateAudio } from "@/hooks/use-audio"
import type { AudioFormData } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditContentPage() {
  const params = useParams()
  const router = useRouter()
  const audioId = params.id as string

  const { data: categoriesData } = useCategories()
  const { data: audioData, isLoading: audioLoading } = useAudio(audioId)
  const updateAudioMutation = useUpdateAudio()

  const [formData, setFormData] = useState<AudioFormData>({
    title: "",
    subject: "",
    language: "english",
    description: "",
    tags: [],
    author: "",
    about: "",
    category: "",
    chapters: [],
    audioFile: undefined,
    coverImage: undefined,
  })

  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (audioData?.data) {
      const audio = audioData.data
      setFormData({
        title: audio.title,
        subject: audio.subject,
        language: audio.language,
        description: audio.description,
        tags: audio.tags,
        author: audio.author,
        about: audio.about,
        category: audio.category,
        chapters: audio.chapter.map((ch) => ({
          title: ch.title,
          start: ch.start,
          end: ch.end,
        })),
        audioFile: undefined,
        coverImage: undefined,
      })
    }
  }, [audioData])

  const addChapter = () => {
    setFormData({
      ...formData,
      chapters: [...formData.chapters, { title: "", start: "00:00:00", end: "00:00:00" }],
    })
  }

  const updateChapter = (index: number, field: string, value: string) => {
    const newChapters = [...formData.chapters]
    newChapters[index] = { ...newChapters[index], [field]: value }
    setFormData({ ...formData, chapters: newChapters })
  }

  const removeChapter = (index: number) => {
    setFormData({
      ...formData,
      chapters: formData.chapters.filter((_, i) => i !== index),
    })
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, audioFile: file })
    }
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, coverImage: file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateAudioMutation.mutateAsync({ id: audioId, data: formData })
      router.push("/content")
    } catch (error) {
      console.error("Error updating content:", error)
    }
  }

  if (audioLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 bg-gray-600" />
              <Skeleton className="h-4 w-64 bg-gray-600 mt-2" />
            </div>
            <Skeleton className="h-10 w-24 bg-gray-600" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#334155] p-6 rounded-lg border border-gray-600">
                  <Skeleton className="h-6 w-32 bg-gray-600 mb-4" />
                  <Skeleton className="h-10 w-full bg-gray-600" />
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#334155] p-6 rounded-lg border border-gray-600">
                  <Skeleton className="h-6 w-32 bg-gray-600 mb-4" />
                  <Skeleton className="h-10 w-full bg-gray-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Content</h1>
            <p className="text-gray-400">Dashboard &gt; Content &gt; Edit Content</p>
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-[#C5A46D] hover:bg-[#B8956A] text-white"
            disabled={updateAudioMutation.isPending}
          >
            {updateAudioMutation.isPending ? "Updating..." : "Update"} <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Upload */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Audio File (optional)</Label>
              <div className="mt-4 border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#C5A46D] rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-gray-400 mb-4">Upload new audio file to replace current one.</p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    className="hidden"
                    id="audio-upload"
                  />
                  <Button
                    type="button"
                    className="bg-[#C5A46D] hover:bg-[#B8956A] text-white"
                    onClick={() => document.getElementById("audio-upload")?.click()}
                  >
                    Replace Audio
                  </Button>
                  {formData.audioFile && <p className="text-green-400 mt-2">{formData.audioFile.name}</p>}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Title</Label>
              <Input
                placeholder="Type Title here..."
                className="mt-2 bg-[#2A3441] border-gray-600 text-white"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Subject */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Subject</Label>
              <Input
                placeholder="Type Subject here..."
                className="mt-2 bg-[#2A3441] border-gray-600 text-white"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            {/* Author */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Author</Label>
              <Input
                placeholder="Author name..."
                className="mt-2 bg-[#2A3441] border-gray-600 text-white"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Description</Label>
              <Textarea
                placeholder="Type description here..."
                className="mt-2 min-h-32 bg-[#2A3441] border-gray-600 text-white resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* About */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">About</Label>
              <Textarea
                placeholder="About this content..."
                className="mt-2 min-h-32 bg-[#2A3441] border-gray-600 text-white resize-none"
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                required
              />
            </div>

            {/* Tags */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Tags</Label>
              <div className="mt-2 p-4 bg-[#2A3441] border border-gray-600 rounded-lg min-h-24">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-[#C5A46D] text-white hover:bg-[#B8956A] px-3 py-1"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-red-300">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Add new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="bg-[#2A3441] border-gray-600 text-white"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} className="bg-[#C5A46D] hover:bg-[#B8956A] text-white">
                  Add
                </Button>
              </div>
            </div>

            {/* Chapters */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Chapters</Label>
              <div className="mt-4 space-y-4">
                {formData.chapters.map((chapter, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                      <Label className="text-gray-300 text-sm">Chapter {index + 1} Name:</Label>
                      <Input
                        placeholder="Type chapter name here..."
                        className="mt-1 bg-[#2A3441] border-gray-600 text-white"
                        value={chapter.title}
                        onChange={(e) => updateChapter(index, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Start:</Label>
                      <Input
                        placeholder="00:00:00"
                        className="mt-1 bg-[#2A3441] border-gray-600 text-white"
                        value={chapter.start}
                        onChange={(e) => updateChapter(index, "start", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">End:</Label>
                      <Input
                        placeholder="00:00:00"
                        className="mt-1 bg-[#2A3441] border-gray-600 text-white"
                        value={chapter.end}
                        onChange={(e) => updateChapter(index, "end", e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addChapter}
                      className="bg-[#C5A46D] hover:bg-[#B8956A] text-white h-10 w-10 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => removeChapter(index)}
                      className="bg-red-600 hover:bg-red-700 text-white h-10 w-10 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-2 bg-[#2A3441] border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.data?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger className="mt-2 bg-[#2A3441] border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="urdu">Urdu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cover Image */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Cover Image (optional)</Label>
              <div className="mt-4 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#C5A46D] rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-400 mb-4 text-sm">Replace current cover image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                    id="cover-upload"
                  />
                  <Button
                    type="button"
                    className="bg-[#C5A46D] hover:bg-[#B8956A] text-white"
                    onClick={() => document.getElementById("cover-upload")?.click()}
                  >
                    Replace Image
                  </Button>
                  {formData.coverImage && <p className="text-green-400 mt-2 text-sm">{formData.coverImage.name}</p>}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
