// /actions/dashboard/symptom-relief-tips/update-symptom-relief-tip-by-id.ts

"use server";

import { auth } from "@/auth";
import {
  UpdateSymptomReliefTipData,
  UpdateSymptomReliefTipResponse,
} from "@/types/symptom-relief-tip.type";

/**
 * Updates an existing Symptom Relief Tip by its ID.
 * @param {string} id - The ID of the tip to update.
 * @param {Omit<UpdateSymptomReliefTipData, 'id'>} payload - The fields to update.
 * @returns {Promise<UpdateSymptomReliefTipResponse>} The API response.
 */
export const updateSymptomReliefTip = async (
  id: string,
  payload: Omit<UpdateSymptomReliefTipData, "id"> // Payload does not need ID in its body
): Promise<UpdateSymptomReliefTipResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Include the ID in the URL path
    const endpoint = `${process.env.BACKEND_API_URL}/pregnancy/symptom-relief-tips/${id}`;

    // The body only includes the fields being updated
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      // Propagate the specific error message (e.g., 404 Not Found, 400 Bad Request)
      throw new Error(
        errorResult.message || `API failed with status ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message ||
          "Failed to update symptom relief tip (API success: false)"
      );
    }

    return {
      success: true,
      message: result.message || "Symptom relief tip updated successfully",
      // Pass the nested data structure as received
      data: result.data,
    };
  } catch (error) {
    console.error(`Update Symptom Relief Tip (ID: ${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};