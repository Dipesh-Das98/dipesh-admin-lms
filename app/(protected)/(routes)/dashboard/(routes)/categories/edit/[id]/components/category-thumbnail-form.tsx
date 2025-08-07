"use client";

import React from "react";
import { Category } from "@/types/category.type";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { updateCategory } from "@/actions/dashboard/category/update-category";
import { FilterX } from "lucide-react";
import { Features } from "@/types";

interface CategoryThumbnailFormProps {
  category: Category;
}

export function CategoryThumbnailForm({
  category,
}: CategoryThumbnailFormProps) {
  const categoryWithTitle = {
    ...category,
    title: category.name, // Use name as the title for display purposes
    thumbnail: category.thumbnail || undefined, // Convert null to undefined
  };

  const updateCategoryWrapper = async (data: {
    id: string;
    thumbnail?: string;
  }) => {
    return await updateCategory({ thumbnail: data.thumbnail }, category.id);
  };

  return (
    <GenericThumbnailForm
      entity={categoryWithTitle}
      entityType="category"
      updateMutation={updateCategoryWrapper}
      queryKey={["categories"]}
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
        headerIcon: <FilterX className="w-6 h-6 text-blue-600" />,
        headerColor: "blue",
        showImageInfo: true,
      }}
      feature={Features.CATEGORIES}
    />
  );
}
