"use server";

import { auth } from "@/auth";
import {
  ReadAlongStory,
  GetReadAlongStoryResponse,
} from "@/types/readAlongWith.types";

export const getReadAlongStoryById = async (
  id: string
): Promise<GetReadAlongStoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!id) {
      throw new Error("Story ID is required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/readAlongStories/get-read-along-story/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch story");
    }

    return {
      success: true,
      message: result.message || "Story fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Get read-along story error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
