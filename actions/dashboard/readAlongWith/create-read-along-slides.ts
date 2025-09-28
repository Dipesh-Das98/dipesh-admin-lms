"use server";

import { auth } from "@/auth";
import {
  CreateReadAlongSlidesData,
  CreateReadAlongSlidesResponse,
} from "@/types/readAlongWith.types";

export const createReadAlongSlides = async (
  data: CreateReadAlongSlidesData
): Promise<CreateReadAlongSlidesResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate slideList
    if (!Array.isArray(data.slideList) || data.slideList.length === 0) {
      throw new Error("slideList must be a non-empty array");
    }

    for (const slide of data.slideList) {
      const { readWithUsId, content, imageUrl, orderNo } = slide;

      if (
        !readWithUsId ||
        !content ||
        !imageUrl ||
        typeof orderNo !== "number"
      ) {
        throw new Error(
          "Each slide must include readWithUsId, content, imageUrl, and a valid orderNo"
        );
      }
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/readAlongStories/create-slides`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create slides");
    }

    return {
      success: true,
      message: result.message || "Slides created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create read-along slides error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
