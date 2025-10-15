"use server";

import { auth } from "@/auth"; // Your authentication utility
import {
  CreatePregnancyNutritionData,
  CreatePregnancyNutritionResponse,
} from "@/types/pregnancy-nutrition.type"; // Import your types (must match the structure above)

export const createPregnancyNutritionTip = async (
  data: CreatePregnancyNutritionData
): Promise<CreatePregnancyNutritionResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // FIX: Update endpoint path to match the cURL URL: /pregnancy-nutrition
    const endpoint = `${process.env.BACKEND_API_URL}/pregnancy-nutrition`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Handle non-2xx status codes (e.g., 400, 401, 409)
    if (!response.ok) {
        const errorResult = await response.json();
        // Propagate the specific error message from the API
        throw new Error(errorResult.message || `API failed with status ${response.status}`);
    }

    // Process successful response (201 Created)
    const result: CreatePregnancyNutritionResponse = await response.json();

    if (!result.success || !result.data) {
      // This handles a 2xx response where the body still indicates failure (less common, but safe)
      throw new Error(result.message || "Failed to create nutrition tip (API success: false)");
    }

    return {
      success: true,
      message: result.message || "Nutrition tip created successfully",
      // Return the entire result body including the nested 'data' field
      data: result.data,
    };

  } catch (error) {
    console.error("Create Pregnancy Nutrition Tip error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};