// actions/vaccination/deleteVaccination.ts
"use server";

import { auth } from "@/auth";
import { DeleteVaccinationResponse } from "@/types/vaccination.type"; // Assuming you put the types in this path

/**
 * Deletes a vaccination record by its ID in the backend.
 * @param id - The unique identifier (UUID) of the vaccination record to delete.
 * @returns A promise resolving to the DeleteVaccinationResponse.
 */
export const deleteVaccination = async (
  id: string
): Promise<DeleteVaccinationResponse> => {
  try {
    // 1. Authentication and Token Check
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token available.");
    }

    // 2. API Call
    // The ID is interpolated directly into the URL path.
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/vaccination/${id}`,
      {
        method: "DELETE", // Matches your cURL -X 'DELETE'
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`, // Matches your cURL -H 'Authorization...'
        },
        // DELETE requests do not typically have a body
      }
    );

    // 3. Process Response
    const result = await response.json();

    // Check for failure (e.g., HTTP 404/403/500, or a 'success: false' payload)
    if (!response.ok || !result.success) {
      // Use the message from the backend if available, otherwise a generic one
      throw new Error(
        result.message || `Failed to delete vaccination with status: ${response.status}`
      );
    }
    
    // 4. Successful Response
    return {
      success: true,
      message: result.message || "Vaccination deleted successfully",
    };
  } catch (error) {
    // 5. Error Handling
    console.error(`Delete Vaccination by ID (${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while deleting the vaccination record.",
    };
  }
};