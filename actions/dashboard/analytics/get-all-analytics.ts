"use server";

import { auth } from "@/auth"; // <-- Import the auth function
import {
  DashboardContentResponse,
  DashboardContentData,
} from "@/types/analytics.type";

// Use the process.env variable pattern from your original example
const DASHBOARD_API_URL = `${process.env.BACKEND_API_URL}/auth/admin/dashboard-content`;

/**
 * Fetches the comprehensive dashboard content and statistics from the external API,
 * using the authenticated Admin session token.
 *
 * @returns {Promise<DashboardContentResponse>} The structured response containing dashboard data or an error message.
 */
export async function getDashboardContentAction(): Promise<DashboardContentResponse> {
  // 1. Retrieve the session
  try {
    const session = await auth();

    // 2. Check for the session and backendToken
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required. Admin token is missing.");
    }

    const ADMIN_AUTH_TOKEN = session.user.backendToken;

    const response = await fetch(DASHBOARD_API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // 3. Use the retrieved token
        Authorization: `Bearer ${ADMIN_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      // Ensure data is fresh
      next: {
        revalidate: 60, // Revalidate data every 60 seconds
      },
    });

    // Check for non-successful HTTP status codes
    if (!response.ok) {
      const errorDetail = await response.text();
      // Use the standard error structure from your first example
      throw new Error(
        `API call failed with status ${response.status}: ${errorDetail.substring(
          0,
          100
        )}...`
      );
    }

    const result = (await response.json()) as DashboardContentResponse;

    if (!result.success) {
      // Throw an error for API response where success is false
      throw new Error(result.message || "Failed to retrieve dashboard content.");
    }

    // Return the successful response in the desired structure
    return {
      success: true,
      message: result.message || "Dashboard content retrieved successfully",
      data: result.data as DashboardContentData,
    };
  } catch (error) {
    console.error("Get Dashboard Content error:", error);

    // Return the standard error object
    return {
      success: false,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching dashboard content",
    };
  }
}