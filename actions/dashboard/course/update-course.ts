"use server";

import { auth } from "@/auth";

export interface UpdateCourseData {
  id: string;
  title?: string;
  description?: string;
  categoryId?: string;
  grade?: string;
  language?: string;
  backgroundColor?: string;
  thumbnail?: string;
  isPublished?: boolean;
}

export interface UpdateCourseResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    description?: string;
    categoryId?: string;
    grade: string;
    language: string;
    backgroundColor: string;
    thumbnail?: string;
    isPublished: boolean;
  };
}

export const updateCourse = async (
  data: UpdateCourseData
): Promise<UpdateCourseResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (!data.id) {
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

    console.log("Updating course with data:", data);

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/course/update-course/${data.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          grade: data.grade,
          language: data.language,
          backgroundColor: data.backgroundColor,
          thumbnail: data.thumbnail,
          isPublished: data.isPublished,
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
      throw new Error(result.message || "Failed to update course");
    }
    console.log("Course updated successfully:", result.data);
    return {
      success: true,
      message: result.message || "Course updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating course:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update course",
    };
  }
};
