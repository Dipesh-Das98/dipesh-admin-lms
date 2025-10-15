"use server";

import { auth } from "@/auth";
import {
  GetPregnancyWeekResponse,
  PregnancyWeekContent, // Imported for the return type
} from "@/types/pregnancy.type";

// Base API URL part (ID will be appended)
const API_BASE_URL = `${process.env.BACKEND_API_URL}/pregnancy/pregnancy-week-content`;

export const getPregnancyWeekContentById = async (
  id: string // The ID is passed as a path parameter
): Promise<GetPregnancyWeekResponse> => {
  try {
    const session = await auth();

    // 1. Authentication Check
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token found.");
    }

    // 2. API Call (using the GET method and appending the ID)
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET", // Changed to GET
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json", // Still good practice to include
      },
    });

    const result = await response.json();

    // 3. API Response Success Check
    if (!response.ok || !result.success) {
      // Throw an error for a bad response (e.g., 404 Not Found, 403 Forbidden)
      throw new Error(result.message || `Failed to fetch pregnancy week content for ID: ${id}`);
    }

    // 4. Successful Return
    // The data structure is slightly different for the GET endpoint (data is NOT nested under data)
    return {
      success: true,
      message: result.message || "Request processed successfully",
      // The actual data is directly under 'data' in the API response
      data: result.data as PregnancyWeekContent, 
    };

  } catch (error) {
    console.error(`Get Pregnancy Week Content error for ID ${id}:`, error);

    // 5. Error Handling
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};