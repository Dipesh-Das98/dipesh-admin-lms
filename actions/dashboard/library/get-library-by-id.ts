"use server";

import { auth } from "@/auth";
import { Library } from "@/types";

interface GetLibraryResponse {
  success: boolean;
  data?: Library;
  message?: string;
}

export const getLibraryById = async (id: string): Promise<GetLibraryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!id) {
      throw new Error("Library ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/library/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch library");
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    console.error("Get library error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
}; 