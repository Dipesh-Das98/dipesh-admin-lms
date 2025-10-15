// /actions/dashboard/symptom-relief-tips/create-symptom-relief-tip.ts

"use server";

import { auth } from "@/auth"; // Your authentication utility
import {
  CreateSymptomReliefTipData,
  CreateSymptomReliefTipResponse,
} from "@/types/symptom-relief-tip.type"; // Import your types

export const createSymptomReliefTip = async (
  data: CreateSymptomReliefTipData
): Promise<CreateSymptomReliefTipResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // NOTE: Hardcoding the endpoint path based on the cURL you provided
    const endpoint = `${process.env.BACKEND_API_URL}/pregnancy/symptom-relief-tips/create-symptom-relief-tip`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // NOTE: We MUST check for a non-2xx status before calling .json() if we expect a custom error format
    if (!response.ok) {
        const errorResult = await response.json();
        // Propagate the specific error message from the API (e.g., 409 Conflict)
        throw new Error(errorResult.message || `API failed with status ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      // This is unlikely if response.ok is true, but included for safety
      throw new Error(result.message || "Failed to create symptom relief tip (API success: false)");
    }

    return {
      success: true,
      message: result.message || "Symptom relief tip created successfully",
      // Pass the nested data structure as received from the API on success
      data: result.data, 
    };
  } catch (error) {
    console.error("Create Symptom Relief Tip error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};