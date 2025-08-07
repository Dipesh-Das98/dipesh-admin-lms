"use client";

import React from "react";
import { ReadAlongSlide } from "@/types/readAlongWith.types";
import { SlideCard } from "./SlideCard";

interface SlideRowProps {
  slides: ReadAlongSlide[];
  onEditClick: (slide: ReadAlongSlide) => void;
}

export function SlideRow({ slides, onEditClick }: SlideRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {slides.map((slide) => (
        <SlideCard key={slide.id} slide={slide} onEditClick={onEditClick} />
      ))}
    </div>
  );
}
