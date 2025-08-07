"use client";

import React from "react";
import { ReadAlongSlide } from "@/types/readAlongWith.types";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideCardProps {
  slide: ReadAlongSlide;
  onEditClick: (slide: ReadAlongSlide) => void;
}

export function SlideCard({ slide, onEditClick }: SlideCardProps) {
  return (
    <div className="relative group rounded-lg border border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative w-full h-28 bg-muted/20">
        {slide.imageUrl ? (
          <Image
            src={slide.imageUrl}
            alt="Slide thumbnail"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-1">
        <p className="text-xs font-medium text-foreground line-clamp-2">
          {slide.content}
        </p>
        <p className="text-xs text-muted-foreground">Order #{slide.orderNo}</p>
      </div>

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEditClick(slide)}
          className="flex items-center gap-1 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}
