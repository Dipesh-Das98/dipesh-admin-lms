"use server";

import { auth } from "@/auth";
import {
  DeletePregnancyNutritionResponse,
} from "@/types/pregnancy-nutrition.type";

/**
 * Deletes an existing Pregnancy Nutrition Tip by ID via a DELETE request to the API.
 * @param id The unique ID of the tip to delete.
 */
export const deletePregnancyNutritionTip = async (
  id: string
): Promise<DeletePregnancyNutritionResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!id) {
      throw new Error("Tip ID is required for deletion.");
    }

    // FIX: Construct endpoint path with the ID for the DELETE request
    const endpoint = `${process.env.BACKEND_API_URL}/pregnancy-nutrition/${id}`;

    const response = await fetch(endpoint, {
      method: "DELETE", // Use DELETE method as specified in cURL
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
      },
    });

    // Handle non-2xx status codes (e.g., 404 Not Found)
    if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `API failed with status ${response.status}`);
    }

    // Process successful response (200 OK)
    const result: DeletePregnancyNutritionResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete nutrition tip (API success: false)");
    }

    return {
      success: true,
      message: result.message || "Nutrition deleted successfully",
      // Include the nested data message if present
      data: result.data, 
    };

  } catch (error) {
    console.error(`Delete Pregnancy Nutrition Tip ID ${id} error:`, error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};