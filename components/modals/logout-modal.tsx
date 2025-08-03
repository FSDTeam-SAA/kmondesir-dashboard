"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { signOut } from "next-auth/react"

interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C2A3A] border-gray-600 text-white max-w-md">
        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-[#C5A46D]" />
          </div>
          <div className="mb-2">
            <div className="text-white font-semibold text-lg">MP3Books</div>
            <div className="text-gray-400 text-sm">MP3 Files of Classical Islamic Books</div>
          </div>

          <h2 className="text-xl font-semibold text-[#C5A46D] mb-8">Are You Sure To Log Out?</h2>

          <div className="flex space-x-4">
            <Button onClick={handleLogout} className="flex-1 bg-[#C5A46D] hover:bg-[#B8956A] text-white">
              Yes
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-[#C5A46D] text-[#C5A46D] hover:bg-[#C5A46D] hover:text-white"
            >
              NO
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
