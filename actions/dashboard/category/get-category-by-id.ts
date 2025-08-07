"use server";

import { auth } from "@/auth";
import { Category, GetCategoryResponse } from "@/types/category.type";

export const getCategoryById = async (categoryId: string): Promise<GetCategoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    if (!categoryId) {
      return {
        success: false,
        message: "Category ID is required",
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/categories/${categoryId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch category");
    }

    return {
      success: true,
      message: result.message || "Category fetched successfully",
      data: result.data as Category,
    };
  } catch (error) {
    console.error("Get category error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
