"use server";

import { auth } from "@/auth";

export interface ReorderChaptersData {
  courseId: string;
  chapters: Array<{
    id: string;
    position: number;
  }>;
}

export interface ReorderChaptersResponse {
  success: boolean;
  message: string;
  data?: Array<{
    id: string;
    position: number;
  }>;
}

export const reorderChapters = async (
  data: ReorderChaptersData
): Promise<ReorderChaptersResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (!data.courseId) {
      throw new Error("Course ID is required");
    }

    if (!Array.isArray(data.chapters) || data.chapters.length === 0) {
      throw new Error("Chapters array is required and cannot be empty");
    }

    // Validate each chapter item
    for (const chapter of data.chapters) {
      if (!chapter.id) {
        throw new Error("Chapter ID is required for each chapter");
      }
      if (typeof chapter.position !== "number" || chapter.position < 0) {
        throw new Error("Valid position is required for each chapter");
      }
    }

    console.log("Reordering chapters with data:", data);

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/course/reorder-chapters/${data.courseId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapters: data.chapters,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to reorder chapters");
    }

    console.log("Chapters reordered successfully:", result.data);
    return {
      success: true,
      message: result.message || "Chapters reordered successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error reordering chapters:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to reorder chapters",
    };
  }
};
