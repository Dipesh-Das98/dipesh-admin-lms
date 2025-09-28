"use server";

import { auth } from "@/auth";

export interface DeleteStoryResponse {
  success: boolean;
  message: string;
}

export const deleteStory = async (storyId: string): Promise<DeleteStoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!storyId) {
      throw new Error("Story ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/story/${storyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete story");
    }

    return {
      success: true,
      message: result.message || "Story deleted successfully",
    };
  } catch (error) {
    console.error("Delete story error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
