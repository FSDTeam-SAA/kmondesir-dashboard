"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useSubscriptions, useDeleteSubscription } from "@/hooks/use-subscriptions"
import { EditSubscriptionModal } from "@/components/modals/edit-subscription-modal"
import type { Subscription } from "@/types/api"
import { useState } from "react"
import { DeleteConfirmationModal } from "./_components/DeleteConfirmationModal"

export default function SubscriptionPage() {
  const { data: subscriptionsData, isLoading, error } = useSubscriptions()
  const deleteSubscriptionMutation = useDeleteSubscription()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)

  const handleDelete = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedSubscription) {
      await deleteSubscriptionMutation.mutateAsync(selectedSubscription._id)
      setDeleteModalOpen(false)
      setSelectedSubscription(null)
    }
  }

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setEditModalOpen(true)
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-400">Error loading subscriptions: {error.message}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Subscription</h1>
            <p className="text-gray-400">Dashboard &gt; Subscription</p>
          </div>
          <Link href="/subscription/create">
            <Button className="bg-[#C5A46D] hover:bg-[#B8956A] text-black hover:text-white">
              Create Subscription <Plus className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-[#334155] rounded-lg border border-gray-600">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-600">
                <TableHead className="text-gray-300">Plan Name</TableHead>
                <TableHead className="text-gray-300">Price</TableHead>
                <TableHead className="text-gray-300">Features</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index} className="border-gray-600">
                      <TableCell>
                        <Skeleton className="h-4 w-[120px] bg-gray-600" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px] bg-gray-600" />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-[200px] bg-gray-600" />
                          <Skeleton className="h-3 w-[180px] bg-gray-600" />
                          <Skeleton className="h-3 w-[160px] bg-gray-600" />
                        </div>
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
                : subscriptionsData?.data?.map((subscription) => (
                    <TableRow key={subscription._id} className="border-gray-600">
                      <TableCell className="text-white font-medium">{subscription.planName}</TableCell>
                      <TableCell className="text-gray-300">${subscription.price}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {subscription.feature.length > 0 ? (
                            subscription.feature.map((feature, index) => (
                              <div key={index} className="text-gray-300 text-sm">
                                {feature}
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-400 text-sm">No features listed</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            subscription.planValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subscription.planValid ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-gray-700"
                            onClick={() => handleEdit(subscription)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                            onClick={() => handleDelete(subscription)}
                            disabled={deleteSubscriptionMutation.isPending}
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
      </div>
      <EditSubscriptionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        subscription={selectedSubscription}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        isPending={deleteSubscriptionMutation.isPending}
        planName={selectedSubscription?.planName}
      />
    </DashboardLayout>
  )
}