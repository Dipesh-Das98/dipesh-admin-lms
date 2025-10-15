// /actions/dashboard/symptom-relief-tips/get-all-symptom-relief-tips.ts

"use server";

import { auth } from "@/auth";
import {
  GetAllSymptomReliefTipsParams,
  GetAllSymptomReliefTipsResponse,
} from "@/types/symptom-relief-tip.type";

/**
 * Fetches all Symptom Relief Tips with pagination, filtering, and searching.
 * @param {GetAllSymptomReliefTipsParams} params - Pagination and filter parameters.
 * @returns {Promise<GetAllSymptomReliefTipsResponse>} The paginated API response.
 */
export const getAllSymptomReliefTips = async (
  params: GetAllSymptomReliefTipsParams
): Promise<GetAllSymptomReliefTipsResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const query = new URLSearchParams();

    // Set required pagination parameters
    query.set("page", params.page.toString());
    query.set("limit", params.limit.toString());
    
    // Set optional parameters
    if (params.search) query.set("search", params.search);
    if (params.isActive !== undefined) query.set("isActive", String(params.isActive));

    // NOTE: The endpoint is '/update-symptom-relief-tip', which is unusual for a GET ALL, 
    // but based on your cURL, we use it.
    const endpoint = `${process.env.BACKEND_API_URL}/pregnancy/symptom-relief-tips/update-symptom-relief-tip?${query.toString()}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || `API failed with status ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch symptom relief tips (API success: false)");
    }

    return {
      success: true,
      message: result.message || "Symptom relief tips fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Get All Symptom Relief Tips error:", error);

    // Ensure the failure response structure matches the success structure for safety
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: {
        symptomReliefTips: [],
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