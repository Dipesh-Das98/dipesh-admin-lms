"use server";

import { auth } from "@/auth";

export interface DeleteGameResponse {
  success: boolean;
  message: string;
}

export async function deleteGame(
  gameId: string
): Promise<DeleteGameResponse> {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!gameId) {
      throw new Error("Game ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/game/${gameId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete game");
    }

    return {
      success: true,
      message: result.message || "Game deleted successfully",
    };
  } catch (error) {
    console.error("Delete game error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
}
