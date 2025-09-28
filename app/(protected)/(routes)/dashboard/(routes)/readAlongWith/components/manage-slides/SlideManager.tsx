"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReadAlongSlide } from "@/types/readAlongWith.types";
import { getReadAlongSlidesByStoryId } from "@/actions/dashboard/readAlongWith/get-read-along-with-slide-by-story-id";
import TopSection from "./TopSection";
import BottomSection from "./BottomSection";
import { deleteReadAlongSlideById } from "@/actions/dashboard/readAlongWith/delete-read-along-with-slide-by-id";

interface SlideManagerProps {
  storyId: string;
}

export type SlideMode = "idle" | "add" | "edit";

export default function SlideManager({ storyId }: SlideManagerProps) {
  const [mode, setMode] = React.useState<SlideMode>("idle");
  const [selectedSlide, setSelectedSlide] = React.useState<ReadAlongSlide | null>(null);

  

  // Fetch all slides for the given story ID
  const {
    data: slides = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["slides", storyId],
    queryFn: async () => {
      const response = await getReadAlongSlidesByStoryId(storyId);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data.sort((a, b) => a.orderNo - b.orderNo);
    },
    enabled: !!storyId,
  });

  const handleDeleteSlide = async (id: string) => {
  const res = await deleteReadAlongSlideById(id);
  if (res.success) {
    toast.success("Slide deleted");
    setMode("idle");
    setSelectedSlide(null);
    await refetch(); // otherwise we can invalidate query if using react-query
  } else {
    toast.error(res.message || "Failed to delete slide");
  }
};


  // Handlers
  const handleCreateClick = () => {
    setMode("add");
    setSelectedSlide(null);
  };

  const handleEditClick = (slide: ReadAlongSlide) => {
    setSelectedSlide(slide);
    setMode("edit");
  };

  const handleCancel = () => {
    setMode("idle");
    setSelectedSlide(null);
  };

  const handleSlideUpdated = async () => {
    await refetch();
    setMode("idle");
    setSelectedSlide(null);
    toast.success("Slide updated!");
  };

  return (
    <div className="space-y-8">
      <TopSection
        slides={slides}
        isLoading={isLoading}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
      />

      <BottomSection
        mode={mode}
        storyId={storyId}
        slide={selectedSlide}
        onCancel={handleCancel}
        onSuccess={handleSlideUpdated}
        onDelete={handleDeleteSlide}
      />
    </div>
  );
}
