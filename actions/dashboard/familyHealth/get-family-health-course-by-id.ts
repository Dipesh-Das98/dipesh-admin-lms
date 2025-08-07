"use server";

import { auth } from "@/auth";
import {
  GetSingleFamilyHealthCourseResponse,
} from "@/types/familyHealth.types";

export const getSingleFamilyHealthCourse = async (
  id: string
): Promise<GetSingleFamilyHealthCourseResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/family-health-course/get-all-courses/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          Accept: "*/*",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch course");
    }

    return {
      success: true,
      message: result.message || "Course fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Get Family Health Course by ID error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
