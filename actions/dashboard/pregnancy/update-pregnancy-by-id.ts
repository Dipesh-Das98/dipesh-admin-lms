"use server";

import { auth } from "@/auth";
import {
  UpdatePregnancyWeekData,
  UpdatePregnancyWeekResponse,
  PregnancyWeekContent, // Imported for the return type
} from "@/types/pregnancy.type";

// Base API URL part (ID will be appended)
const API_BASE_URL = `${process.env.BACKEND_API_URL}/pregnancy/pregnancy-week-content`;

export const updatePregnancyWeekContent = async (
  id: string, // The ID is passed as a path parameter
  data: UpdatePregnancyWeekData
): Promise<UpdatePregnancyWeekResponse> => {
  try {
    const session = await auth();

    // 1. Authentication Check
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token found.");
    }

    // 2. API Call (using the PATCH method and appending the ID)
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH", // Changed to PATCH
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      // Data is sent in the body
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // 3. API Response Success Check
    if (!response.ok || !result.success) {
      // Throw an error with the API's message if it's available
      throw new Error(result.message || "Failed to update pregnancy week content");
    }

    // 4. Successful Return
    return {
      success: true,
      message: result.message || "Pregnancy week content updated successfully",
      // The actual updated data is nested under 'data' in the API response
      data: result.data.data, 
    };

  } catch (error) {
    console.error(`Update Pregnancy Week Content error for ID ${id}:`, error);

    // 5. Error Handling
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};