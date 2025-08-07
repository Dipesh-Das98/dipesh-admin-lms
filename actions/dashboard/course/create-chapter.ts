"use server";

import { auth } from "@/auth";

export interface CreateChapterData {
  courseId: string;
  title: string;
}

export interface CreateChapterResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    position: number;
    courseId: string;
  };
}

export const createChapter = async (
  data: CreateChapterData
): Promise<CreateChapterResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (!data.courseId) {
      throw new Error("Course ID is required");
    }

    if (!data.title || data.title.trim().length < 1) {
      throw new Error("Chapter title is required");
    }

    if (data.title.length > 100) {
      throw new Error("Chapter title must be less than 100 characters");
    }

    console.log("Creating chapter with data:", data);

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/course/create-chapter/${data.courseId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title.trim(),
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
      throw new Error(result.message || "Failed to create chapter");
    }

    console.log("Chapter created successfully:", result.data);
    return {
      success: true,
      message: result.message || "Chapter created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error creating chapter:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create chapter",
    };
  }
};
