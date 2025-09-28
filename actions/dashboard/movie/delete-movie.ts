"use server";

import { auth } from "@/auth";

export interface DeleteMovieResponse {
  success: boolean;
  message: string;
}

export const deleteMovie = async (movieId: string): Promise<DeleteMovieResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!movieId) {
      throw new Error("Movie ID is required");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/movie/${movieId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete movie");
    }

    return {
      success: true,
      message: result.message || "Movie deleted successfully",
    };
  } catch (error) {
    console.error("Delete movie error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
