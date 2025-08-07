"use server";

import { auth } from "@/auth";
import {
  DeleteVarietyResponse,
} from "@/types/variety.type";

export const deleteVariety = async (
  id: string
): Promise<DeleteVarietyResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/variety/delete-variety/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          Accept: "*/*",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete course");
    }

    return {
      success: true,
      message: result.message || "Course deleted successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Delete Family Health Course error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};