"use server";

import { auth } from "@/auth";

export interface DeleteCourseResponse {
  success: boolean;
  message: string;
}

export async function deleteCourse(
  courseId: string
): Promise<DeleteCourseResponse> {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!courseId) {
      throw new Error("Course ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/course/delete-course/${courseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete course");
    }

    return {
      success: true,
      message: result.message || "Course deleted successfully",
    };
  } catch (error) {
    console.error("Delete course error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
}
