"use server";

import { auth } from "@/auth";
import {
  DeletePregnancyWeekResponse,
} from "@/types/pregnancy.type";

// Base API URL part (ID will be appended)
const API_BASE_URL = `${process.env.BACKEND_API_URL}/pregnancy/pregnancy-week-content`;

export const deletePregnancyWeekContent = async (
  id: string // The ID of the item to delete
): Promise<DeletePregnancyWeekResponse> => {
  try {
    const session = await auth();

    // 1. Authentication Check
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token found.");
    }

    // 2. API Call (using the DELETE method and appending the ID)
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE", // Changed to DELETE
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // 3. API Response Success Check
    if (!response.ok || !result.success) {
      // Throw an error for a bad response (e.g., 404 Not Found, 403 Forbidden)
      throw new Error(result.message || `Failed to delete pregnancy week content for ID: ${id}`);
    }

    // 4. Successful Return
    return {
      success: true,
      // Use the message from the API response
      message: result.message || "Pregnancy week content deleted successfully",
    };

  } catch (error) {
    console.error(`Delete Pregnancy Week Content error for ID ${id}:`, error);

    // 5. Error Handling
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};