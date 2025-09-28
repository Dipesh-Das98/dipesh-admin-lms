"use server";

import { auth } from "@/auth";
import { CreateCategoryData, CreateCategoryResponse } from "@/types/category.type";

export const createCategory = async (
  data: CreateCategoryData
): Promise<CreateCategoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (!data.name || !data.type || !data.description) {
      throw new Error("Name, type, and description are required");
    }

    if (data.description.length > 500) {
      throw new Error("Description must be less than 500 characters");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        type: data.type,
        description: data.description,
        backgroundColor: data.backgroundColor || "",
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create category");
    }

    return {
      success: true,
      message: result.message || "Category created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create category error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};