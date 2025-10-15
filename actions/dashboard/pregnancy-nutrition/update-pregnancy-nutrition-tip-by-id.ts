"use server";

import { auth } from "@/auth";
import {
  UpdatePregnancyNutritionData,
  UpdatePregnancyNutritionResponse,
} from "@/types/pregnancy-nutrition.type";

/**
 * Updates an existing Pregnancy Nutrition Tip by ID via a PATCH request to the API.
 * @param id The unique ID of the tip to update.
 * @param data The full payload containing all fields to update.
 */
export const updatePregnancyNutritionTip = async (
  id: string,
  data: UpdatePregnancyNutritionData
): Promise<UpdatePregnancyNutritionResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!id) {
      throw new Error("Tip ID is required for update.");
    }

    // FIX: Construct endpoint path with the ID for the PATCH request
    const endpoint = `${process.env.BACKEND_API_URL}/pregnancy-nutrition/${id}`;

    const response = await fetch(endpoint, {
      method: "PATCH", // Use PATCH method as specified in cURL
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Handle non-2xx status codes (e.g., 404 Not Found, 400 Bad Request)
    if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `API failed with status ${response.status}`);
    }

    // Process successful response (200 OK)
    const result: UpdatePregnancyNutritionResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to update nutrition tip (API success: false)");
    }

    return {
      success: true,
      message: result.message || "Nutrition tip updated successfully",
      // Return the entire result body including the nested 'data' field
      data: result.data, 
    };

  } catch (error) {
    console.error(`Update Pregnancy Nutrition Tip ID ${id} error:`, error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};