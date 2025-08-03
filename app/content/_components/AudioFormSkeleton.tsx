"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AudioFormSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-700 rounded-md" />
          <div className="h-8 w-48 bg-slate-700 rounded" />
        </div>
        <div className="h-10 w-20 bg-amber-600 rounded" />
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Audio Upload and Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio Upload Card */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="h-6 w-24 bg-slate-700 rounded" />
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8">
                <div className="mx-auto h-12 w-12 bg-slate-700 rounded mb-4" />
                <div className="h-4 w-40 bg-slate-700 rounded mx-auto mb-4" />
                <div className="h-10 w-32 bg-amber-600 rounded mx-auto" />
              </div>
            </CardContent>
          </Card>

          {/* Title */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-slate-700 rounded" />
            <div className="h-10 w-full bg-slate-800 rounded border border-slate-600" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-700 rounded" />
            <div className="h-32 w-full bg-slate-800 rounded border border-slate-600" />
          </div>

          {/* Author and Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-slate-700 rounded" />
              <div className="h-10 w-full bg-slate-800 rounded border border-slate-600" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-slate-700 rounded" />
              <div className="h-10 w-full bg-slate-800 rounded border border-slate-600" />
            </div>
          </div>

          {/* About */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-slate-700 rounded" />
            <div className="h-20 w-full bg-slate-800 rounded border border-slate-600" />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-slate-700 rounded" />
            <div className="flex gap-2 mb-2">
              <div className="h-10 w-full bg-slate-800 rounded border border-slate-600" />
              <div className="h-10 w-16 bg-slate-700 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-amber-600 rounded" />
              <div className="h-6 w-24 bg-amber-600 rounded" />
            </div>
          </div>

          {/* Chapters Card */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="h-6 w-24 bg-slate-700 rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chapter Row */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <div className="h-4 w-24 bg-slate-700 rounded mb-2" />
                  <div className="h-10 w-full bg-slate-700 rounded" />
                </div>
                <div className="col-span-3">
                  <div className="h-4 w-16 bg-slate-700 rounded mb-2" />
                  <div className="h-10 w-full bg-slate-700 rounded" />
                </div>
                <div className="col-span-3">
                  <div className="h-4 w-16 bg-slate-700 rounded mb-2" />
                  <div className="h-10 w-full bg-slate-700 rounded" />
                </div>
                <div className="col-span-1">
                  <div className="h-10 w-10 bg-slate-700 rounded" />
                </div>
              </div>
              {/* Add Chapter Button */}
              <div className="h-10 w-32 bg-amber-600 rounded" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Genre, Thumbnail, Language */}
        <div className="space-y-6">
          {/* Genre */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-700 rounded" />
            <div className="h-10 w-full bg-slate-800 rounded border border-slate-600" />
          </div>

          {/* Thumbnail Card */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="h-6 w-24 bg-slate-700 rounded" />
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-center">
                <div className="h-32 w-32 bg-slate-700 rounded-lg" />
              </div>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8">
                <div className="mx-auto h-12 w-12 bg-slate-700 rounded mb-4" />
                <div className="h-4 w-48 bg-slate-700 rounded mx-auto mb-4" />
                <div className="h-10 w-32 bg-amber-600 rounded mx-auto" />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-700 rounded" />
            <div className="h-10 w-full bg-slate-800 rounded border border-slate-600" />
          </div>

          {/* Submit Button */}
          <div className="h-10 w-full bg-amber-600 rounded" />
        </div>
      </div>
    </div>
  );
}