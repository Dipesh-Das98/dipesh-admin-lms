"use server";

import { auth } from "@/auth";

export interface PublishChapterData {
  id: string;
  courseId: string;
  isPublished: boolean;
}

export interface PublishChapterResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    isPublished: boolean;
  };
}

export const publishChapter = async (
  chapterId: string,
  courseId: string,
  isPublished: boolean
): Promise<PublishChapterResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (!chapterId) {
      throw new Error("Chapter ID is required");
    }
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    console.log("Publishing chapter with data:", { chapterId, courseId, isPublished });

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/course/update-chapter/${chapterId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: chapterId,
          courseId: courseId,
          isPublished: isPublished,
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
      throw new Error(result.message || "Failed to publish/unpublish chapter");
    }

    console.log("Chapter published successfully:", result.data);
    return {
      success: true,
      message: result.message || `Chapter ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: result.data,
    };
  } catch (error) {
    console.error("Error publishing chapter:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to publish/unpublish chapter",
    };
  }
};