"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteAudio } from "@/hooks/use-audio"
import { Audio } from "@/types/audio"

interface DeleteAudioModalProps {
  audio: Audio | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAudioModal({ audio, open, onOpenChange }: DeleteAudioModalProps) {
  const deleteAudio = useDeleteAudio()

  const handleDelete = async () => {
    if (!audio) return

    try {
      await deleteAudio.mutateAsync(audio._id)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to delete audio:", error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Audio</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{audio?.title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteAudio.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteAudio.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
