"use client"

import type React from "react"
import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCategories } from "@/hooks/use-categories"
import { useCreateAudio } from "@/hooks/use-audio"
import type { AudioFormData } from "@/types/api"
import { Badge } from "@/components/ui/badge"

export default function CreateContentPage() {
  const router = useRouter()
  const { data: categoriesData } = useCategories()
  const createAudioMutation = useCreateAudio()

  const [formData, setFormData] = useState<AudioFormData>({
    title: "",
    subject: "",
    language: "english",
    description: "",
    tags: [],
    author: "",
    about: "",
    category: "",
    chapters: [
      { title: "", start: "00:00:00", end: "00:00:00" },
      { title: "", start: "00:00:00", end: "00:00:00" },
      { title: "", start: "00:00:00", end: "00:00:00" },
    ],
    audioFile: undefined,
    coverImage: undefined,
  })

  const [newTag, setNewTag] = useState("")

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
      await createAudioMutation.mutateAsync(formData)
      router.push("/content")
    } catch (error) {
      console.error("Error creating content:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Create Content</h1>
            <p className="text-gray-400">Dashboard &gt; Content &gt; Create Content</p>
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-[#C5A46D] hover:bg-[#B8956A] text-white"
            disabled={createAudioMutation.isPending}
          >
            {createAudioMutation.isPending ? "Saving..." : "Save"} <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Upload */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Audio File</Label>
              <div className="mt-4 border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#C5A46D] rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-gray-400 mb-4">Upload Your Audiobook.</p>
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
                    Add Audio
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

            {/* Chapter */}
            <div className="bg-[#334155] p-6 rounded-lg border border-gray-600">
              <Label className="text-white text-lg font-medium">Chapters</Label>
              <div className="mt-4 space-y-4">
                {formData.chapters.map((chapter, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                    {index === formData.chapters.length - 1 && (
                      <Button
                        type="button"
                        onClick={addChapter}
                        className="bg-[#C5A46D] hover:bg-[#B8956A] text-white h-10 w-10 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
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
              <Label className="text-white text-lg font-medium">Cover Image</Label>
              <div className="mt-4 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#C5A46D] rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-400 mb-4 text-sm">Drag and drop image here, or click add image</p>
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
                    Add Image
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
