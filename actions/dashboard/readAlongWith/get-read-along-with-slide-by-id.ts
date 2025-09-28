"use server";

import { auth } from "@/auth";
import {
  ReadAlongSlide,
  GetSingleReadAlongSlideResponse,
} from "@/types/readAlongWith.types";

export const getReadAlongSlideById = async (
  slideId: string
): Promise<GetSingleReadAlongSlideResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!slideId) {
      throw new Error("Slide ID is required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/readAlongStories/get-slide/${slideId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch slide");
    }

    return {
      success: true,
      message: result.message || "Slide fetched successfully",
      data: result.data as ReadAlongSlide,
    };
  } catch (error) {
    console.error("Fetch single slide error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
