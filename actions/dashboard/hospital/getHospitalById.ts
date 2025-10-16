// actions/hospital/getHospitalById.ts
"use server";

import { auth } from "@/auth";
import { HospitalRecord } from "@/types/hospital.type"; 

/**
 * Defines the response structure for fetching a single hospital.
 * It uses the HospitalRecord type defined previously.
 */
export type GetHospitalResponse = {
  success: boolean;
  message: string;
  data?: HospitalRecord; // The fetched hospital data
};

/**
 * Fetches a single hospital record from the backend by its ID.
 * @param hospitalId - The ID of the hospital to fetch (e.g., '45fb6bb1-f5cc-489e-ba91-7c350efcecfa').
 * @returns A promise resolving to the GetHospitalResponse.
 */
export const getHospitalById = async (
  hospitalId: string
): Promise<GetHospitalResponse> => {
  try {
    // 1. Authentication and Token Check
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token available.");
    }

    // 2. API Call (Endpoint uses the hospitalId)
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/hospital/${hospitalId}`,
      {
        method: "GET", // Matches your cURL -X 'GET'
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`, // Matches your cURL -H 'Authorization...'
          "Content-Type": "application/json",
        },
        // No body required for a GET request
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
    // The response structure matches the 200 res provided (data is NOT nested under 'data')
    return {
      success: true,
      message: result.message || "Hospital fetched successfully",
      data: result.data, // Contains the HospitalRecord object
    };

  } catch (error) {
    // 5. Error Handling
    console.error(`Get Hospital by ID (${hospitalId}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching the hospital.",
    };
  }
};