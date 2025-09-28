"use server";

import { auth } from "@/auth";
import {
  ReadAlongSlide,
  UpdateReadAlongSlideData,
  UpdateReadAlongSlideResponse,
} from "@/types/readAlongWith.types";

export const updateReadAlongSlideById = async (
  slideId: string,
  data: UpdateReadAlongSlideData
): Promise<UpdateReadAlongSlideResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!slideId) {
      throw new Error("Slide ID is required");
    }

    const { readWithUsId, content, imageUrl, orderNo } = data;

    if (!readWithUsId || !content || !imageUrl || typeof orderNo !== "number") {
      throw new Error(
        "readWithUsId, content, imageUrl, and a valid orderNo are required"
      );
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/readAlongStories/update-slide/${slideId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update slide");
    }

    return {
      success: true,
      message: result.message || "Slide updated successfully",
      data: result.data as ReadAlongSlide,
    };
  } catch (error) {
    console.error("Update slide error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
