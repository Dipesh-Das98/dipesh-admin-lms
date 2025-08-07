"use server";

import { auth } from "@/auth";
import { Library, UpdateLibraryData } from "@/types";

interface UpdateLibraryResponse {
  success: boolean;
  message: string;
  data?: Library;
}

export const updateLibrary = async (
  data: UpdateLibraryData
): Promise<UpdateLibraryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!data.id) {
      throw new Error("Library ID is required");
    }

    if (data.description && data.description.length > 500) {
      throw new Error("Description must be less than 500 characters");
    }

    const updatePayload: Partial<UpdateLibraryData> = {};
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.grade !== undefined) updatePayload.grade = data.grade;
    if (data.language !== undefined) updatePayload.language = data.language;
    if (data.categoryId !== undefined) updatePayload.categoryId = data.categoryId;
    if (data.thumbnail !== undefined) updatePayload.thumbnail = data.thumbnail;
    if (data.mediaUrl !== undefined) updatePayload.mediaUrl = data.mediaUrl;
    if (data.backgroundColor !== undefined) updatePayload.backgroundColor = data.backgroundColor;
    if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
    if (data.order !== undefined) updatePayload.order = data.order;


    const response = await fetch(`${process.env.BACKEND_API_URL}/library/${data.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update library");
    }

    return {
      success: true,
      message: result.message || "Library updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Update library error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
}; 