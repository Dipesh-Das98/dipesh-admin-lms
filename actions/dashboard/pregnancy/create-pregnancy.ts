"use server";

import { auth } from "@/auth";
import {
  CreatePregnancyWeekData,
  CreatePregnancyWeekResponse,
} from "@/types/pregnancy.type";

// The API endpoint from your cURL:
// 'https://lms-backend-prod-api.up.railway.app/pregnancy/pregnancy-week-content'
const API_ENDPOINT = `${process.env.BACKEND_API_URL}/pregnancy/pregnancy-week-content`;

export const createPregnancyWeekContent = async (
  data: CreatePregnancyWeekData
): Promise<CreatePregnancyWeekResponse> => {
  try {
    const session = await auth();

    // 1. Authentication Check
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token found.");
    }

    // 2. API Call (using the details from your cURL)
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        // Authorization header uses the Bearer token from the session
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
      throw new Error(result.message || "Failed to create pregnancy week content");
    }

    // 4. Successful Return
    return {
      success: true,
      message: result.message || "Pregnancy week content created successfully",
      // The actual created data is nested under 'data' in the API response
      data: result.data.data, 
    };

  } catch (error) {
    console.error("Create Pregnancy Week Content error:", error);

    // 5. Error Handling
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};