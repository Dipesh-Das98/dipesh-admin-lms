"use server";

import { auth } from "@/auth";
import { createLibrarySchema } from "@/schema";
import { Library } from "@/types";
import { z } from "zod";

interface CreateLibraryResponse {
  success: boolean;
  message: string;
  data?: Library;
}

export const createLibrary = async (
  data: z.infer<typeof createLibrarySchema>
): Promise<CreateLibraryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (
      !data.title ||
      !data.description ||
      !data.language ||
      !data.categoryId
    ) {
      throw new Error("All required fields must be provided");
    }

    if (data.description.length > 500) {
      throw new Error("Description must be less than 500 characters");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/library`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        language: data.language,
        categoryId: data.categoryId,
        backgroundColor: data.backgroundColor,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create library");
    }

    return {
      success: true,
      message: result.message || "Library created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create library error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
