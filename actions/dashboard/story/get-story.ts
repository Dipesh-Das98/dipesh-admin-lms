"use server";

import { auth } from "@/auth";
import { Story } from "@/types";

export interface GetStoryResponse {
  success: boolean;
  message: string;
  data?: Story;
}

export const getStory = async (storyId: string): Promise<GetStoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    if (!storyId) {
      return {
        success: false,
        message: "Story ID is required",
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/story/${storyId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
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
      data: result.data as Story,
    };
  } catch (error) {
    console.error("Get story error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
