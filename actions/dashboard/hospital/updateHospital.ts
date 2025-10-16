// actions/hospital/updateHospital.ts
"use server";

import { auth } from "@/auth";
import {
  UpdateHospitalData,
  UpdateHospitalResponse,
} from "@/types/hospital.type"; // Assumed path for the types

/**
 * Updates an existing hospital record in the backend.
 * @param hospitalId - The ID of the hospital to update.
 * @param data - The hospital data to be updated (can be a partial object).
 * @returns A promise resolving to the UpdateHospitalResponse.
 */
export const updateHospital = async (
  hospitalId: string,
  data: UpdateHospitalData
): Promise<UpdateHospitalResponse> => {
  try {
    // 1. Authentication and Token Check
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token available.");
    }

    // 2. API Call (Endpoint uses the hospitalId and PATCH method)
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/hospital/${hospitalId}`,
      {
        method: "PATCH", // Matches your cURL -X 'PATCH'
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`, // Matches your cURL -H 'Authorization...'
          "Content-Type": "application/json", // Matches your cURL -H 'Content-Type...'
        },
        body: JSON.stringify(data), // Sends the input data as JSON
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
    // The response structure matches the 200 res provided (data is nested under 'data')
    return {
      success: true,
      message: result.data?.message || result.message || "Hospital updated successfully",
      data: result.data.data, // This is the nested data object with the updated record
    };

  } catch (error) {
    // 5. Error Handling
    console.error(`Update Hospital (${hospitalId}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during hospital update.",
    };
  }
};