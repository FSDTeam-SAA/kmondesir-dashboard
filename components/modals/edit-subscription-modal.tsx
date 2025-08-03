"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"
import { useUpdateSubscription } from "@/hooks/use-subscriptions"
import type { Subscription, SubscriptionFormData } from "@/types/api"

interface EditSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription | null
}

export function EditSubscriptionModal({ open, onOpenChange, subscription }: EditSubscriptionModalProps) {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    planName: "",
    price: 0,
    planValid: true,
    feature: [],
  })
  const [newFeature, setNewFeature] = useState("")

  const updateSubscriptionMutation = useUpdateSubscription()

  useEffect(() => {
    if (subscription) {
      setFormData({
        planName: subscription.planName,
        price: subscription.price,
        planValid: subscription.planValid,
        feature: subscription.feature,
      })
    }
  }, [subscription])

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      feature: formData.feature.filter((_, i) => i !== index),
    })
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        feature: [...formData.feature, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subscription) return

    await updateSubscriptionMutation.mutateAsync({ id: subscription._id, data: formData })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#334155] border-gray-600 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Name and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Plan Name</Label>
              <Input
                placeholder="Enter plan name"
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                className="bg-[#2A3441] border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-white">Price</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                className="bg-[#2A3441] border-gray-600 text-white"
                required
              />
            </div>
          </div>

          {/* Plan Status */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.planValid}
              onCheckedChange={(checked) => setFormData({ ...formData, planValid: checked })}
            />
            <Label className="text-white">Plan Active</Label>
          </div>

          {/* Features */}
          <div>
            <Label className="text-white">Features</Label>
            <div className="mt-2 p-4 bg-[#2A3441] border border-gray-600 rounded-lg min-h-24">
              <div className="flex flex-wrap gap-2">
                {formData.feature.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#C5A46D] text-white hover:bg-[#B8956A] px-3 py-1"
                  >
                    {feature}
                    <button type="button" onClick={() => removeFeature(index)} className="ml-2 hover:text-red-300">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Add new feature..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="bg-[#2A3441] border-gray-600 text-white"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} className="bg-[#C5A46D] hover:bg-[#B8956A] text-white">
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C5A46D] hover:bg-[#B8956A] text-white"
              disabled={updateSubscriptionMutation.isPending}
            >
              {updateSubscriptionMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
