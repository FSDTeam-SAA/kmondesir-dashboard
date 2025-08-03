"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Audio } from "@/types/audio"
import { AudioList } from "./_components/audio-list"
import { AudioForm } from "./_components/audio-form"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

const queryClient = new QueryClient()

type View = "list" | "create" | "edit"

function AudioManagementApp() {
  const [currentView, setCurrentView] = useState<View>("list")
  const [selectedAudio, setSelectedAudio] = useState<Audio | null>(null)

  const handleCreateNew = () => {
    setSelectedAudio(null)
    setCurrentView("create")
  }

  const handleEdit = (audio: Audio) => {
    setSelectedAudio(audio)
    setCurrentView("edit")
  }

  const handleSuccess = () => {
    setCurrentView("list")
    setSelectedAudio(null)
  }

  const handleCancel = () => {
    setCurrentView("list")
    setSelectedAudio(null)
  }

  return (
    <DashboardLayout>
      {currentView === "list" && <AudioList onEdit={handleEdit} onCreateNew={handleCreateNew} />}

      {(currentView === "create" || currentView === "edit") && (
        <AudioForm audio={selectedAudio || undefined} onSuccess={handleSuccess} onCancel={handleCancel} />
      )}
    </DashboardLayout>
  )
}

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioManagementApp />
    </QueryClientProvider>
  )
}
