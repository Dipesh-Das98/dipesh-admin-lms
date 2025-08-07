"use server";

import { auth } from "@/auth";
import { Music } from "@/types";

export interface GetMusicResponse {
  success: boolean;
  message: string;
  data?: Music;
}

export const getMusicById = async (musicId: string): Promise<GetMusicResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    if (!musicId) {
      return {
        success: false,
        message: "Music ID is required",
      }
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/music/${musicId}`,
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
      throw new Error(result.message || "Failed to fetch music");
    }

    return {
      success: true,
      message: result.message || "Music fetched successfully",
      data: result.data as Music,
    };
  } catch (error) {
    console.error("Get music error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
