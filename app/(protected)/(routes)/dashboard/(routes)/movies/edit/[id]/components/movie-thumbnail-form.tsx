"use client";

import React from "react";
import { Features, Movie  } from "@/types";
import { updateMovie } from "@/actions/dashboard/movie/update-movie";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { Film } from "lucide-react";

interface MovieThumbnailFormProps {
  movie: Movie;
}

export function MovieThumbnailForm({ movie }: MovieThumbnailFormProps) {
  return (
    <GenericThumbnailForm
      entity={movie}
      entityType="movie"
      updateMutation={updateMovie}
      queryKey={["movies"]}
      maxSize={10 * 1024 * 1024} // 10MB for movies
      acceptedFormats="image/*"
      recommendations={{
        size: "1200x630px",
        aspectRatio: "16:9 or 1.91:1",
        formats: "JPG, PNG, WebP",
        maxFileSize: "10MB",
      }}
      displaySettings={{
        imageHeight: "h-96",
        headerIcon: <Film className="w-6 h-6 text-orange-600" />,
        headerColor: "orange",
        showImageInfo: true,
      }}
      feature={Features.MOVIES} // Feature type for upload
    />
  );
}
