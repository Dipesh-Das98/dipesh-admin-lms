"use server";

import { auth } from "@/auth";
import {
  ReadAlongSlide,
  GetReadAlongSlidesResponse,
} from "@/types/readAlongWith.types";

export const getReadAlongSlidesByStoryId = async (
  storyId: string
): Promise<GetReadAlongSlidesResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!storyId) {
      throw new Error("Story ID is required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/readAlongStories/get-slides/${storyId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch slides");
    }

    return {
      success: true,
      message: result.message || "Slides fetched successfully",
      data: result.data as ReadAlongSlide[],
    };
  } catch (error) {
    console.error("Fetch slides by story ID error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
      data: [],
    };
  }
};
