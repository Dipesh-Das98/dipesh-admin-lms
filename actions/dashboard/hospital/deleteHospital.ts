// actions/hospital/deleteHospital.ts
"use server";

import { auth } from "@/auth";
import {
  DeleteHospitalResponse,
} from "@/types/hospital.type"; // Assumed path for the types

/**
 * Deletes a hospital record from the backend by its ID.
 * @param hospitalId - The ID of the hospital to delete.
 * @returns A promise resolving to the DeleteHospitalResponse.
 */
export const deleteHospital = async (
  hospitalId: string
): Promise<DeleteHospitalResponse> => {
  try {
    // 1. Authentication and Token Check
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token available.");
    }

    // 2. API Call (Endpoint uses the hospitalId and DELETE method)
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/hospital/${hospitalId}`,
      {
        method: "DELETE", // Matches your cURL -X 'DELETE'
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`, // Matches your cURL -H 'Authorization...'
          "Content-Type": "application/json",
        },
        // No body required for a DELETE request
      }
    );

    // 3. Process Response
    const result = await response.json();

    // Check for API-level failure (e.g., HTTP 4xx, 5xx) or a 'success: false' payload
    if (!response.ok || result.success === false) {
      // Use the message from the backend if available, otherwise a generic one
      throw new Error(result.message || `API call failed with status: ${response.status}`);
    }

    // 4. Successful Response
    // The response structure matches the 200 res provided (simple success message)
    return {
      success: true,
      message: result.message || "Hospital deleted successfully",
      data: result.data, // Contains the nested message object
    };

  } catch (error) {
    // 5. Error Handling
    console.error(`Delete Hospital (${hospitalId}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during hospital deletion.",
    };
  }
};