"use server";

import { auth } from "@/auth";

export interface UpdateChapterData {
  id: string;
  courseId?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  isPublished?: boolean;
  videoUrl?: string;
}

export interface UpdateChapterResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    isPublished: boolean;
    videoUrl?: string;
  };
}

export const updateChapter = async (
  data: UpdateChapterData
): Promise<UpdateChapterResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (!data.id) {
      throw new Error("Chapter ID is required");
    }
    if (!data.courseId) {
      throw new Error("Course ID is required");
    }

    // Validate optional fields if provided
    if (data.title && data.title.length < 1) {
      throw new Error("Title cannot be empty");
    }

    if (data.title && data.title.length > 100) {
      throw new Error("Title must be less than 100 characters");
    }

    if (data.description && data.description.length > 1000) {
      throw new Error("Description must be less than 1000 characters");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/course/update-chapter/${data.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
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
      throw new Error(result.message || "Failed to update Chapter");
    }
    console.log("Chapter updated successfully:", result.data);
    return {
      success: true,
      message: result.message || "Chapter updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating Chapter:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update Chapter",
    };
  }
};
