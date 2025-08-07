"use server";

import { auth } from "@/auth";
import { Language } from "@/config/forms/child-form-options";

export interface UpdateMovieData {
  id: string;
  title?: string;
  description?: string;
  backgroundColor?: string;
  grade?: string;
  language?: Language;
  categoryId?: string;
  thumbnail?: string;
  mediaUrl?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateMovieResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    description: string;
    backgroundColor: string;
    grade: string;
    language: Language;
    categoryId: string;
  };
}

export const updateMovie = async (
  data: UpdateMovieData
): Promise<UpdateMovieResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!data.id) {
      throw new Error("Movie ID is required");
    }

    const updatePayload: Partial<UpdateMovieData> = {};
    
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.backgroundColor !== undefined) updatePayload.backgroundColor = data.backgroundColor;
    if (data.grade !== undefined) updatePayload.grade = data.grade;
    if (data.language !== undefined) updatePayload.language = data.language;
    if (data.categoryId !== undefined) updatePayload.categoryId = data.categoryId;
    if (data.thumbnail !== undefined) updatePayload.thumbnail = data.thumbnail;
    if (data.mediaUrl !== undefined) updatePayload.mediaUrl = data.mediaUrl;
    if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
    if (data.order !== undefined) updatePayload.order = data.order;

    const response = await fetch(`${process.env.BACKEND_API_URL}/movie/${data.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update movie");
    }

    return {
      success: true,
      message: result.message || "Movie updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Update movie error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
