"use server";

import { auth } from "@/auth";
import {
  UpdateVarietyData,
  UpdateVarietyResponse,
} from "@/types/variety.type";

export const updateVariety = async (
  data: UpdateVarietyData
): Promise<UpdateVarietyResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const { id, ...updatePayload } = data;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/variety/update-variety/${id}`,
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