"use server";

import { auth } from "@/auth";
import { Ethics } from "@/types/ethics.type";

export interface GetEthicsResponse {
  success: boolean;
  message: string;
  data?: Ethics;
}

export const getEthicsById = async (ethicsId: string): Promise<GetEthicsResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    if (!ethicsId) {
      return {
        success: false,
        message: "Ethics ID is required",
      }
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/ethics/${ethicsId}`,
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
      throw new Error(result.message || "Failed to fetch ethics");
    }

    return {
      success: true,
      message: result.message || "Ethics fetched successfully",
      data: result.data as Ethics,
    };
  } catch (error) {
    console.error("Get ethics error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
