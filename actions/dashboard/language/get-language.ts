"use server";

import { auth } from "@/auth";
import { LanguageCorner } from "@/types/language.type";

export interface GetLanguageCornerResponse {
  success: boolean;
  message: string;
  data?: LanguageCorner;
}

export const getLanguageCornerById = async (languageCornerId: string): Promise<GetLanguageCornerResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    if (!languageCornerId) {
      return {
        success: false,
        message: "Language corner ID is required",
      }
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/language-corner/${languageCornerId}`,
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
      throw new Error(result.message || "Failed to fetch language corner");
    }

    return {
      success: true,
      message: result.message || "Language corner fetched successfully",
      data: result.data as LanguageCorner,
    };
  } catch (error) {
    console.error("Get language corner error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
