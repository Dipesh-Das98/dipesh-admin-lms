"use server";

import { auth } from "@/auth";

export interface DeleteChildData {
  id: string;
}

export interface DeleteChildResponse {
  success: boolean;
  message: string;
}

export const deleteChild = async (
  data: DeleteChildData
): Promise<DeleteChildResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const { id } = data;

    if (!id) {
      throw new Error("Child ID is required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/children/${id}`,
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
      throw new Error(result.message || "Failed to delete child account");
    }

    return {
      success: true,
      message: result.message || "Child account deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting child:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
