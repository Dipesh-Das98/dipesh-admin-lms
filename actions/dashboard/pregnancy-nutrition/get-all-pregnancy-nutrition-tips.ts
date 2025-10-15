"use server";

import { auth } from "@/auth";
import {
  GetAllPregnancyNutritionTipsParams,
  GetAllPregnancyNutritionTipsResponse,
  GetAllPregnancyNutritionData,
} from "@/types/pregnancy-nutrition.type";

/**
 * Fetches all Pregnancy Nutrition Tips with pagination and filtering.
 * @param {GetAllPregnancyNutritionTipsParams} params - Pagination and filter parameters.
 * @returns {Promise<GetAllPregnancyNutritionTipsResponse>} The paginated API response.
 */
export const getAllPregnancyNutritionTips = async (
  params: GetAllPregnancyNutritionTipsParams
): Promise<GetAllPregnancyNutritionTipsResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const query = new URLSearchParams();

    // Set required pagination parameters
    query.set("page", params.page.toString());
    query.set("limit", params.limit.toString());
    
    // Set optional parameters (assuming support for search and isRecommended)
    if (params.search) query.set("search", params.search);
    if (params.isRecommended !== undefined) query.set("isRecommended", String(params.isRecommended));

    // FIX: Endpoint is just '/pregnancy-nutrition' with query parameters
    const endpoint = `${process.env.BACKEND_API_URL}/pregnancy-nutrition?${query.toString()}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      // Use cache control appropriate for listing data (e.g., revalidate every 5 minutes)
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || `API failed with status ${response.status}`);
    }

    // Process successful response (200 OK)
    const result: GetAllPregnancyNutritionTipsResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to fetch nutrition tips (API success: false)");
    }

    // Explicitly cast the returned data structure
    const data: GetAllPregnancyNutritionData = result.data;

    return {
      success: true,
      message: result.message || "Nutrition tips fetched successfully",
      data,
    };
  } catch (error) {
    console.error("Get All Pregnancy Nutrition Tips error:", error);

    console.error("Get All Symptom Relief Tips error:", error);

    // Ensure the failure response structure matches the success structure for safety
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: {
        nutrition: [],
        meta: {
          total: 0,
          page: params.page,
          limit: params.limit,
          hasNext: false,
        },
      },
    };
  }
};