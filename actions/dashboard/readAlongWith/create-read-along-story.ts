"use server";

import { auth } from "@/auth";
import {
  CreateReadAlongStoryData,
  CreateReadAlongStoryResponse,
} from "@/types/readAlongWith.types";

export const createReadAlongStory = async (
  data: CreateReadAlongStoryData
): Promise<CreateReadAlongStoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // ✅ Validate all required fields including thumbnailUrl
    const {
      title,
      author,
      illustratedBy,
      publishedBy,
      isActive,
      overAllScore,
      // thumbnailUrl,
    } = data;

    if (
      !title ||
      !author ||
      !illustratedBy ||
      !publishedBy ||
      typeof isActive !== "boolean" ||
      typeof overAllScore !== "number"
      // !thumbnailUrl
    ) {
      throw new Error("All fields are required and must be valid");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/readAlongStories/create-story`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          illustratedBy,
          publishedBy,
          isActive,
          overAllScore,
          // thumbnailUrl, // ✅ Now included in request body
        }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create read-along story");
    }

    return {
      success: true,
      message: result.message || "Story created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create read-along story error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
