"use server";

import { auth } from "@/auth";
import {
  ReadAlongStory,
  UpdateReadAlongStoryResponse,
} from "@/types/readAlongWith.types";

export interface UpdateReadAlongStoryData {
  title?: string;
  author?: string;
  illustratedBy?: string;
  publishedBy?: string;
  isActive?: boolean;
  overAllScore?: number;
  thumbnailUrl?: string;
}

export const updateReadAlongStory = async (
  id: string,
  data: UpdateReadAlongStoryData
): Promise<UpdateReadAlongStoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }
    // checks are needed to be added
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/readAlongStories/update-read-along-story/${id}`,
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
      throw new Error(result.message || "Failed to update read-along story");
    }

    return {
      success: true,
      message: result.message || "Story updated successfully",
      data: result.data as ReadAlongStory,
    };
  } catch (error) {
    console.error("Update read-along story error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
