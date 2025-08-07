"use server";

import { auth } from "@/auth";
import { UpdateCategoryData, UpdateCategoryResponse } from "@/types/category.type";

export const updateCategory = async (
  data: UpdateCategoryData,
  id: string
): Promise<UpdateCategoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!id) {
      throw new Error("Category ID is required");
    }
    // Build update payload with only provided fields
    const updatePayload: Partial<UpdateCategoryData> = {};
    
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.type !== undefined) updatePayload.type = data.type;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
    if (data.order !== undefined) updatePayload.order = data.order;
    if (data.grade !== undefined) updatePayload.grade = data.grade;
    if (data.backgroundColor !== undefined) updatePayload.backgroundColor = data.backgroundColor;
    if (data.thumbnail !== undefined) updatePayload.thumbnail = data.thumbnail;
    if (data.videoUrl !== undefined) updatePayload.videoUrl = data.videoUrl;
    if (data.isDummyCategory !== undefined) updatePayload.isDummyCategory = data.isDummyCategory;

    const response = await fetch(`${process.env.BACKEND_API_URL}/categories/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update category");
    }

    return {
      success: true,
      message: result.message || "Category updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Update category error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
