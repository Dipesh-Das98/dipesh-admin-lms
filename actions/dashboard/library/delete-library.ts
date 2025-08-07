"use server";

import { auth } from "@/auth";

interface DeleteLibraryResponse {
  success: boolean;
  message: string;
}

export const deleteLibrary = async (libraryId: string): Promise<DeleteLibraryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!libraryId) {
      throw new Error("Library ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/library/${libraryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete library");
    }

    return {
      success: true,
      message: result.message || "Library deleted successfully",
    };
  } catch (error) {
    console.error("Delete library error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
}; 