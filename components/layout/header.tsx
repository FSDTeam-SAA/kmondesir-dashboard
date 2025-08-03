"use client"

import { Bars3Icon } from "@heroicons/react/24/outline"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { ChangePasswordModal } from "@/components/modals/change-password-modal"
import { LogoutModal } from "@/components/modals/logout-modal"

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700 bg-[#1C2A3A] px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-gray-700">
                <div className="text-right">
                  <div className="text-sm font-medium">Alex rock</div>
                  <div className="text-xs text-gray-400">Admin</div>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#C5A46D]">
              <DropdownMenuItem
                className="text-white hover:bg-[#B8956A] cursor-pointer"
                onClick={() => setChangePasswordOpen(true)}
              >
                Personal Information
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:bg-[#B8956A] cursor-pointer"
                onClick={() => setChangePasswordOpen(true)}
              >
                Change Password
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      <LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  )
}
