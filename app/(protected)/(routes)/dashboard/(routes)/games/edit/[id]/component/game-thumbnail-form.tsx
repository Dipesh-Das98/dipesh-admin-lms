"use client";

import React from "react";
import { Features, Game } from "@/types";
import { updateGames } from "@/actions/dashboard/game/update-game";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { Gamepad2 } from "lucide-react";

interface GameThumbnailFormProps {
  game: Game;
}

export function GameThumbnailForm({ game }: GameThumbnailFormProps) {
  return (
    <GenericThumbnailForm
      entity={game}
      entityType="game"
      updateMutation={updateGames}
      queryKey={["games"]}
      maxSize={5 * 1024 * 1024} // 5MB
      acceptedFormats="image/*"
      recommendations={{
        size: "1200x630px",
        aspectRatio: "16:9 or 1.91:1",
        formats: "JPG, PNG, WebP",
        maxFileSize: "5MB",
      }}
      displaySettings={{
        imageHeight: "h-80",
        headerIcon: <Gamepad2 className="w-6 h-6 text-blue-600" />,
        headerColor: "blue",
        showImageInfo: true,
      }}
      feature={Features.GAMES}
    />
  );
}
