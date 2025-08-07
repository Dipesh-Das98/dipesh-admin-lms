"use server";

import { auth } from "@/auth";

export interface DeleteMusicResponse {
  success: boolean;
  message: string;
}

export const deleteMusic = async (musicId: string): Promise<DeleteMusicResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!musicId) {
      throw new Error("Music ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/music/${musicId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete music");
    }

    return {
      success: true,
      message: result.message || "Music deleted successfully",
    };
  } catch (error) {
    console.error("Delete music error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
