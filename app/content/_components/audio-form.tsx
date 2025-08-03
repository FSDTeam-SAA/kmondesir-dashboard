"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X, ArrowLeft } from "lucide-react";
import type { Audio, CreateAudioData, AudioChapter } from "@/types/audio";
import Image from "next/image";
import { useCreateAudio, useUpdateAudio } from "@/hooks/use-audio";

interface AudioFormProps {
  audio?: Audio;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AudioForm({ audio, onSuccess, onCancel }: AudioFormProps) {
  const [formData, setFormData] = useState<CreateAudioData>({
    title: audio?.title || "",
    subject: audio?.subject || "",
    language: audio?.language || "english",
    about: audio?.about || "",
    author: audio?.author || "",
    category: audio?.category || "",
    description: audio?.description || "",
    tags: audio?.tags || [],
    chapter: audio?.chapter?.map((ch) => ({
      title: ch.title,
      start: ch.start,
      end: ch.end,
    })) || [{ title: "", start: "00:00:00", end: "00:00:00" }],
    coverImage: audio?.coverImage || "", // For display
    filePath: audio?.filePath || "", // For display
  });

  const [newTag, setNewTag] = useState("");
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | undefined>(
    undefined
  );
  const [selectedCoverImageFile, setSelectedCoverImageFile] = useState<
    File | undefined
  >(undefined);

  const createAudio = useCreateAudio();
  const updateAudio = useUpdateAudio();

  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const coverImageFileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      if (formData.filePath && formData.filePath.startsWith("blob:")) {
        URL.revokeObjectURL(formData.filePath);
      }
      if (formData.coverImage && formData.coverImage.startsWith("blob:")) {
        URL.revokeObjectURL(formData.coverImage);
      }
    };
  }, [formData.filePath, formData.coverImage]);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAudioFile(file);
      setFormData((prev) => ({ ...prev, filePath: URL.createObjectURL(file) })); // For client-side preview
    } else {
      setSelectedAudioFile(undefined);
      setFormData((prev) => ({ ...prev, filePath: audio?.filePath || "" })); // Revert to original or clear
    }
  };

  const handleCoverImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverImageFile(file);
      setFormData((prev) => ({
        ...prev,
        coverImage: URL.createObjectURL(file),
      })); // For client-side preview
    } else {
      setSelectedCoverImageFile(undefined);
      setFormData((prev) => ({ ...prev, coverImage: audio?.coverImage || "" })); // Revert to original or clear
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateAudioData = {
      ...formData,
    };

    try {
      if (audio) {
        await updateAudio.mutateAsync({ ...payload, _id: audio._id });
      } else {
        await createAudio.mutateAsync(payload);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save audio:", error);
      // You might want to display a toast or error message to the user here
    }
  };

  const addChapter = () => {
    setFormData((prev) => ({
      ...prev,
      chapter: [
        ...prev.chapter,
        { title: "", start: "00:00:00", end: "00:00:00" },
      ],
    }));
  };

  const updateChapter = (
    index: number,
    field: keyof Omit<AudioChapter, "_id">,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      chapter: prev.chapter.map((ch, i) =>
        i === index ? { ...ch, [field]: value } : ch
      ),
    }));
  };

  const removeChapter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      chapter: prev.chapter.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const isLoading = createAudio.isPending || updateAudio.isPending;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-white hover:bg-slate-700 bg-gray-500 hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {audio ? "Edit Audio" : "Create New Audio"}
          </h1>
        </div>
        <Button
          onClick={handleSubmit}
          variant="outline"
          className="bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
          disabled={isLoading}
        >
          Save
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Audio Upload and Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio Upload */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Audio</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.filePath && (
                <div className="mb-4">
                  <audio controls src={formData.filePath} className="w-full" />
                  {selectedAudioFile && (
                    <p className="text-sm text-slate-400 mt-2">
                      Selected: {selectedAudioFile.name}
                    </p>
                  )}
                </div>
              )}
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-amber-600 mb-4" />
                <p className="text-slate-300 mb-4">Upload Your Audiobook.</p>
                <Button
                  type="button"
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={() => audioFileInputRef.current?.click()}
                >
                  Add Audio
                </Button>
                <input
                  type="file"
                  ref={audioFileInputRef}
                  onChange={handleAudioFileChange}
                  accept="audio/*"
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Type Title here..."
              className="bg-slate-800 border-slate-600 text-white"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Type description here..."
              className="bg-slate-800 border-slate-600 text-white min-h-32"
              required
            />
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author" className="text-white">
                Author
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                placeholder="Author name"
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-white">
                Subject
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Subject"
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about" className="text-white">
              About
            </Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, about: e.target.value }))
              }
              placeholder="About this audio..."
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-white">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                className="bg-slate-800 border-slate-600 text-white"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" onClick={addTag} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-amber-600 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Chapters */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Chapter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.chapter.map((chapter, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label className="text-white text-sm">
                      Chapter {index + 1} Name:
                    </Label>
                    <Input
                      value={chapter.title}
                      onChange={(e) =>
                        updateChapter(index, "title", e.target.value)
                      }
                      placeholder="Type chapter name here..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-white text-sm">Start:</Label>
                    <Input
                      value={chapter.start}
                      onChange={(e) =>
                        updateChapter(index, "start", e.target.value)
                      }
                      placeholder="00:00:00"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-white text-sm">End:</Label>
                    <Input
                      value={chapter.end}
                      onChange={(e) =>
                        updateChapter(index, "end", e.target.value)
                      }
                      placeholder="00:00:00"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="col-span-1">
                    {formData.chapter.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeChapter(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={addChapter}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Genre and Thumbnail */}
        <div className="space-y-6">
          {/* Genre */}
          <div className="space-y-2">
            <Label className="text-white">Genres Title</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, subject: value }))
              }
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hadith">Hadith</SelectItem>
                <SelectItem value="Heart Softners">Heart Softners</SelectItem>
                <SelectItem value="Quran">Quran</SelectItem>
                <SelectItem value="Islamic History">Islamic History</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Thumbnail */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Thumbnail</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.coverImage && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={formData.coverImage || "/placeholder.svg"}
                    alt="Cover Preview"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-amber-600 mb-4" />
                <p className="text-slate-300 mb-4">
                  Drag and drop image here, or click add image
                </p>
                <Button
                  type="button"
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={() => coverImageFileInputRef.current?.click()}
                >
                  Add Image
                </Button>
                <input
                  type="file"
                  ref={coverImageFileInputRef}
                  onChange={handleCoverImageFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <div className="space-y-2">
            <Label className="text-white">Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
                <SelectItem value="urdu">Urdu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? "Saving..." : audio ? "Update Audio" : "Create Audio"}
          </Button>
        </div>
      </form>
    </div>
  );
}
