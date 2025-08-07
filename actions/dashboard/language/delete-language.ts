"use server";

import { auth } from "@/auth";

export interface DeleteLanguageCornerResponse {
  success: boolean;
  message: string;
}

export const deleteLanguageCorner = async (
  languageCornerId: string
): Promise<DeleteLanguageCornerResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!languageCornerId) {
      throw new Error("Language corner ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/language-corner/${languageCornerId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete language corner");
    }

    return {
      success: true,
      message: result.message || "Language corner deleted successfully",
    };
  } catch (error) {
    console.error("Delete language corner error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
