"use server";

import { auth } from "@/auth";
import { Movie } from "@/types";

export interface GetMovieResponse {
  success: boolean;
  message: string;
  data?: Movie;
}

export const getMovieById = async (movieId: string): Promise<GetMovieResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    if (!movieId) {
      return {
        success: false,
        message: "Movie ID is required",
      }
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/movie/${movieId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch movie");
    }

    return {
      success: true,
      message: result.message || "Movie fetched successfully",
      data: result.data as Movie,
    };
  } catch (error) {
    console.error("Get movie error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
