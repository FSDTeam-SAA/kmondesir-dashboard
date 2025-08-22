"use client";

import type React from "react";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateSubscription } from "@/hooks/use-subscriptions";
import type { SubscriptionFormData } from "@/types/api";

export default function CreateSubscriptionPage() {
  const router = useRouter();
  const createSubscriptionMutation = useCreateSubscription();

  const [formData, setFormData] = useState<SubscriptionFormData>({
    planName: "",
    price: "" as unknown as number,
    planValid: true,
    feature: [],
  });
  const [newFeature, setNewFeature] = useState("");

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      feature: formData.feature.filter((_, i) => i !== index),
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        feature: [...formData.feature, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSubscriptionMutation.mutateAsync(formData);
      router.push("/subscription");
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between max-w-2xl">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Create Subscription
            </h1>
            <p className="text-gray-400">
              Dashboard &gt; Subscription &gt; Create Subscription
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-[#C5A46D] hover:bg-[#B8956A] text-white"
            disabled={createSubscriptionMutation.isPending}
          >
            {createSubscriptionMutation.isPending ? "Saving..." : "Save"}{" "}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* Plan Name and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-white text-lg font-medium">
                Plan Name
              </Label>
              <Input
                placeholder="Enter plan name"
                value={formData.planName}
                onChange={(e) =>
                  setFormData({ ...formData, planName: e.target.value })
                }
                className="mt-2 bg-[#2A3441] border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-white text-lg font-medium">Price</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price === 0 ? "" : formData.price} // show empty if 0
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price:
                      e.target.value === ""
                        ? ("" as unknown as number)
                        : Number.parseFloat(e.target.value),
                  })
                }
                className="mt-2 bg-[#2A3441] border-gray-600 text-white"
                required
              />
            </div>
          </div>

          {/* Plan Status */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.planValid}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, planValid: checked })
              }
            />
            <Label className="text-white text-lg font-medium">
              Plan Active
            </Label>
          </div>

          {/* Features */}
          <div>
            <Label className="text-white text-lg font-medium">Features</Label>
            <div className="mt-2 p-4 bg-[#2A3441] border border-gray-600 rounded-lg min-h-24">
              <div className="flex flex-wrap gap-2">
                {formData.feature.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#C5A46D] text-white hover:bg-[#B8956A] px-3 py-1"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 hover:text-red-300"
                    >
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
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
              />
              <Button
                type="button"
                onClick={addFeature}
                className="bg-[#C5A46D] hover:bg-[#B8956A] text-white"
              >
                Add
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
