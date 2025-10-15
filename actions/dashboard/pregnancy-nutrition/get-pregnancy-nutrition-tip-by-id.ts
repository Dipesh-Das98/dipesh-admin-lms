"use server";

import { auth } from "@/auth";
import {
  GetPregnancyNutritionResponse,
  PregnancyNutritionTip, // The type of the data object
} from "@/types/pregnancy-nutrition.type"; // Import your types

export const getPregnancyNutritionTipById = async (
  id: string
): Promise<GetPregnancyNutritionResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!id) {
      throw new Error("Tip ID is required.");
    }

    // FIX: Construct endpoint path with the ID
    const endpoint = `${process.env.BACKEND_API_URL}/pregnancy-nutrition/${id}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      // Cache settings for GET request (e.g., revalidate every hour)
      next: { revalidate: 3600 }, 
    });

    // Handle non-2xx status codes (e.g., 404 Not Found)
    if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `API failed with status ${response.status}`);
    }

    // Process successful response (200 OK)
    const result = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to fetch nutrition tip (API success: false)");
    }
    
    // The response data is the full tip object
    const tipData: PregnancyNutritionTip = result.data;

    return {
      success: true,
      message: result.message || "Nutrition tip fetched successfully.",
      data: tipData,
    };

  } catch (error) {
    console.error(`Get Pregnancy Nutrition Tip ID ${id} error:`, error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};