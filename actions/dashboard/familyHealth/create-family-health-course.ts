"use server";

import { auth } from "@/auth";
import {
  CreateFamilyHealthCourseData,
  CreateFamilyHealthCourseResponse,
} from "@/types/familyHealth.types";

export const createFamilyHealthCourse = async (
  data: CreateFamilyHealthCourseData
): Promise<CreateFamilyHealthCourseResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/family-health-course/create-course`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create course");
    }

    return {
      success: true,
      message: result.message || "Course created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create Family Health Course error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
