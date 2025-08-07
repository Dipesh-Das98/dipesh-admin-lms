"use server";

import { auth } from "@/auth";
import { DeleteReadAlongSlideResponse } from "@/types/readAlongWith.types";

export const deleteReadAlongSlideById = async (
  slideId: string
): Promise<DeleteReadAlongSlideResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!slideId) {
      throw new Error("Slide ID is required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/readAlongStories/delete-slide/${slideId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete slide");
    }

    return {
      success: true,
      message: result.message || "Slide deleted successfully",
      data: result.data as string, // Assuming it's a confirmation string
    };
  } catch (error) {
    console.error("Delete slide error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
