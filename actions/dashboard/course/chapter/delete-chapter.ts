"use server";

import { auth } from "@/auth";

export interface DeleteChapterResponse {
  success: boolean;
  message: string;
}

export async function deleteChapter(
  chapterId: string
): Promise<DeleteChapterResponse> {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!chapterId) {
      throw new Error("Chapter ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/course/delete-chapter/${chapterId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete chapter");
    }

    return {
      success: true,
      message: result.message || "Chapter deleted successfully",
    };
  } catch (error) {
    console.error("Delete chapter error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
}
