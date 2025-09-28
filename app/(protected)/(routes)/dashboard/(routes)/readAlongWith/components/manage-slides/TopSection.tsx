"use client";

import React from "react";
import { ReadAlongSlide } from "@/types/readAlongWith.types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SlideRow } from "./SlideRow";

interface TopSectionProps {
  slides: ReadAlongSlide[];
  isLoading: boolean;
  onCreateClick: () => void;
  onEditClick: (slide: ReadAlongSlide) => void;
}

export default function TopSection({
  slides,
  isLoading,
  onCreateClick,
  onEditClick,
}: TopSectionProps) {

  const router = useRouter();
  
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Story Slides
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/readAlongWith")}
            size="sm"
          >
            Done
          </Button>
          <Button
            variant="default"
            onClick={onCreateClick}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Create Slide
          </Button>
        </div>
      </div>

      {/* Slide Cards */}
      <div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading slides...</p>
        ) : slides.length === 0 ? (
          <p className="text-sm text-muted-foreground">No slides found.</p>
        ) : (
          <SlideRow slides={slides} onEditClick={onEditClick} />
        )}
      </div>
    </section>
  );
}
