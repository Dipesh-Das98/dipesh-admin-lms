"use server";

import { auth } from "@/auth";
import {
  UpdateFamilyHealthCourseData,
  UpdateFamilyHealthCourseResponse,
} from "@/types/familyHealth.types";

export const updateFamilyHealthCourse = async (
  data: UpdateFamilyHealthCourseData
): Promise<UpdateFamilyHealthCourseResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const { id, ...updatePayload } = data;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/family-health-course/update-course/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update course");
    }

    return {
      success: true,
      message: result.message || "Course updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Update Family Health Course error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
