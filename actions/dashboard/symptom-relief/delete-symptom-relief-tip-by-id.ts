// /actions/dashboard/symptom-relief-tips/delete-symptom-relief-tip-by-id.ts

"use server";

import { auth } from "@/auth";
import { DeleteSymptomReliefTipResponse } from "@/types/symptom-relief-tip.type";

/**
 * Deletes a Symptom Relief Tip by its ID.
 * @param {string} id - The ID of the tip to delete.
 * @returns {Promise<DeleteSymptomReliefTipResponse>} The API response.
 */
export const deleteSymptomReliefTip = async (
  id: string
): Promise<DeleteSymptomReliefTipResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Include the ID in the URL path
    const endpoint = `${process.env.BACKEND_API_URL}/pregnancy/symptom-relief-tips/${id}`;

    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      // DELETE requests typically do not have a body
    });

    if (!response.ok) {
      const errorResult = await response.json();
      // Propagate the specific error message (e.g., 404 Not Found)
      throw new Error(
        errorResult.message || `API failed with status ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message ||
          "Failed to delete symptom relief tip (API success: false)"
      );
    }

    return {
      success: true,
      // Use the top-level message from the API response
      message: result.message || "Symptom relief tip deleted successfully",
      // Pass the nested data structure containing the inner message
      data: result.data,
    };
  } catch (error) {
    console.error(`Delete Symptom Relief Tip (ID: ${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};