"use server";

import { auth } from "@/auth";
import { DeleteCategoryResponse } from "@/types/category.type";

export const deleteCategory = async (
  categoryId: string
): Promise<DeleteCategoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete category");
    }

    return {
      success: true,
      message: result.message || "Category deleted successfully",
    };
  } catch (error) {
    console.error("Delete category error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
