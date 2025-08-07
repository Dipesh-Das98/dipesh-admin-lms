"use client";

import React from "react";
import { ReadAlongSlide } from "@/types/readAlongWith.types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { SlideForm } from "./SlideForm";

interface BottomSectionProps {
  mode: "idle" | "add" | "edit";
  storyId: string;
  slide: ReadAlongSlide | null;
  onCancel: () => void;
  onSuccess: () => void;
  onDelete: (id: string) => void;
}

export default function BottomSection({
  mode,
  storyId,
  slide,
  onCancel,
  onSuccess,
  onDelete,
}: BottomSectionProps) {
  const { openModal } = useModal();

  if (mode === "idle") return null;

  const handleDelete = () => {
    if (!slide) return;
    openModal("confirmation-model", {
      confirmText: "slide",
      handleConfirm: () => {
        onDelete(slide.id);
      },
    });
  };

  return (
    <section className="space-y-4 border-t pt-8 mt-8 border-border/40">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {mode === "add" ? "Add New Slide" : "Edit Slide"}
        </h3>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          {mode === "edit" && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <SlideForm
        mode={mode}
        storyId={storyId}
        slide={slide}
        onSuccess={onSuccess}
      />
    </section>
  );
}
