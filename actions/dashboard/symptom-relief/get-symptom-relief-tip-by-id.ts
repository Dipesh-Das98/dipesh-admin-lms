// /actions/dashboard/symptom-relief-tips/get-symptom-relief-tip-by-id.ts

"use server";

import { auth } from "@/auth";
import {
  GetSymptomReliefTipResponse,
} from "@/types/symptom-relief-tip.type";
import { SymptomReliefTip } from "@/types/symptom-relief-tip.type";


/**
 * Fetches a single Symptom Relief Tip by its unique ID.
 * @param {string} id - The ID of the tip to fetch.
 * @returns {Promise<GetSymptomReliefTipResponse>} The API response.
 */
export const getSymptomReliefTipById = async (
  id: string
): Promise<GetSymptomReliefTipResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const endpoint = `${process.env.BACKEND_API_URL}/pregnancy/symptom-relief-tips/${id}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    // Check for non-2xx status code (handles 404, 401, 500, etc.)
    if (!response.ok) {
      const errorResult = await response.json();
      // Propagate the specific error message (e.g., "Symptom relief tip with ID... not found")
      throw new Error(errorResult.message || `API failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // In a GET request, success is usually implied by response.ok (200), 
    // but we check result.success for safety.
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch symptom relief tip (API success: false)");
    }
    
    // The API response shows 'data' at the top level for the entity.
    const tipData: SymptomReliefTip = result.data;

    return {
      success: true,
      message: result.message || "Request processed successfully",
      data: tipData,
    };
  } catch (error) {
    console.error(`Get Symptom Relief Tip (ID: ${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};