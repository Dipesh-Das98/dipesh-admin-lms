// actions/vaccination/updateVaccination.ts
"use server";

import { auth } from "@/auth";
import {
  UpdateVaccinationData,
  UpdateVaccinationResponse,
  VaccinationResponseData,
} from "@/types/vaccination.type";

/**
 * Updates an existing vaccination record by its ID in the backend.
 * @param id - The unique identifier (UUID) of the vaccination record to update.
 * @param data - The fields and values to update.
 * @returns A promise resolving to the UpdateVaccinationResponse.
 */
export const updateVaccination = async (
  id: string,
  data: UpdateVaccinationData
): Promise<UpdateVaccinationResponse> => {
  try {
    // 1. Authentication and Token Check
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token available.");
    }
    
    // Check if the update data is empty
    if (Object.keys(data).length === 0) {
        throw new Error("Update data cannot be empty.");
    }

    // 2. API Call
    // The ID is interpolated into the URL path, and the data is sent in the body.
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/vaccination/${id}`,
      {
        method: "PATCH", // Matches your cURL -X 'PATCH'
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`, // Matches your cURL -H 'Authorization...'
          "Content-Type": "application/json", // Matches your cURL -H 'Content-Type...'
        },
        body: JSON.stringify(data), // Sends the partial update data as JSON
      }
    );

    // 3. Process Response
    const result = await response.json();

    // Check for failure (e.g., HTTP 404, 500, or a 'success: false' payload)
    if (!response.ok || !result.success) {
      // Use the message from the backend if available, otherwise a generic one
      throw new Error(
        result.message || `Failed to update vaccination with status: ${response.status}`
      );
    }
    
    // 4. Successful Response
    // The response structure matches the 200 res provided (nested data)
    const updatedData: VaccinationResponseData = result.data.data;

    return {
      success: true,
      message: result.data.message || "Vaccination updated successfully",
      data: updatedData,
    };
  } catch (error) {
    // 5. Error Handling
    console.error(`Update Vaccination by ID (${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while updating the vaccination record.",
    };
  }
};