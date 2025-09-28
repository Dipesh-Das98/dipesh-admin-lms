"use server";

import { auth } from "@/auth";

export interface deleteParentData {
  id: string;
}

export interface DeleteParentResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
  };
}

export const deleteParent = async (
  data: deleteParentData
): Promise<DeleteParentResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const { id } = data;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/parent/delete-parent/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update parent account");
    }

    return {
      success: true,
      message: result.message || "Account deleted sucessfully",
    };
  } catch (error) {
    console.error("Error updating parent:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update parent account",
    };
  }
};
