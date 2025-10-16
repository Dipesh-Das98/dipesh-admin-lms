// actions/hospital/createHospital.ts
"use server";

import { auth } from "@/auth";
import {
  CreateHospitalData,
  CreateHospitalResponse,
} from "@/types/hospital.type"; // Assumed path for the types above

/**
 * Creates a new hospital record in the backend.
 * @param data - The hospital data to be created.
 * @returns A promise resolving to the CreateHospitalResponse.
 */
export const createHospital = async (
  data: CreateHospitalData
): Promise<CreateHospitalResponse> => {
  try {
    // 1. Authentication and Token Check
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token available.");
    }

    // 2. API Call (Endpoint from your cURL)
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/hospital/create-hospital`,
      {
        method: "POST", // Matches your cURL -X 'POST'
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
    // The response structure matches the 201 res provided
    return {
      success: true,
      // The backend response is nested, so we extract the relevant parts
      message: result.data?.message || result.message || "Hospital created successfully",
      data: result.data.data, // This is the nested data object with the created record
    };

  } catch (error) {
    // 5. Error Handling
    console.error("Create Hospital error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during hospital creation.",
    };
  }
};