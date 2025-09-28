"use server";

import { auth } from "@/auth";

export interface DeleteMusicResponse {
  success: boolean;
  message: string;
}

export const deleteEthics = async (ethicsId: string): Promise<DeleteMusicResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!ethicsId) {
      throw new Error("Ethics ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/ethics/${ethicsId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete ethics");
    }

    return {
      success: true,
      message: result.message || "Ethics deleted successfully",
    };
  } catch (error) {
    console.error("Delete ethics error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
