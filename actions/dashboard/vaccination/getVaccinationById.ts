// actions/vaccination/getVaccinationById.ts
"use server";

import { auth } from "@/auth";
import {
  VaccinationResponseData,
  GetVaccinationResponse,
} from "@/types/vaccination.type";

/**
 * Fetches a single vaccination record by its ID from the backend.
 * @param id - The unique identifier (UUID) of the vaccination record.
 * @returns A promise resolving to the GetVaccinationResponse.
 */
export const getVaccinationById = async (
  id: string
): Promise<GetVaccinationResponse> => {
  try {
    // 1. Authentication and Token Check
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token available.");
    }

    // 2. API Call
    // NOTE: The ID is interpolated directly into the URL path.
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/vaccination/${id}`,
      {
        method: "GET", // Matches your cURL -X 'GET'
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`, // Matches your cURL -H 'Authorization...'
          // Content-Type is optional for a GET request unless you're passing data
        },
        // GET requests don't typically have a body
      }
    );

    // 3. Process Response
    const result = await response.json();

    // Check for failure (e.g., HTTP 404, 500, or a 'success: false' payload)
    if (!response.ok || !result.success) {
      // Use the message from the backend if available, otherwise a generic one
      throw new Error(
        result.message || `Failed to fetch vaccination with status: ${response.status}`
      );
    }
    
    // 4. Successful Response
    // The main data object is usually returned under 'data' for a successful fetch.
    const vaccinationData: VaccinationResponseData = result.data;

    return {
      success: true,
      message: result.message || "Vaccination record fetched successfully",
      data: vaccinationData,
    };
  } catch (error) {
    // 5. Error Handling
    console.error(`Get Vaccination by ID (${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching the vaccination record.",
    };
  }
};