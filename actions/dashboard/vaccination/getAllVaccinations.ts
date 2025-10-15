// actions/vaccination/getAllVaccinations.ts
"use server";

import { auth } from "@/auth";
import {
  PaginationParams,
  GetAllVaccinationsResponse,
} from "@/types/vaccination.type"; // Assuming you put the types in this path

/**
 * Fetches a paginated, filterable list of vaccination records.
 * @param params - Pagination, search, and sort parameters.
 * @returns A promise resolving to the list of vaccination records and metadata.
 */
export const getAllVaccinations = async (
  params: PaginationParams = {}
): Promise<GetAllVaccinationsResponse> => {
  try {
    // 1. Authentication and Token Check
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token available.");
    }

    // 2. Construct Query Parameters (based on your variety example)
    const query = new URLSearchParams();

    // Dynamically set query parameters if they exist in the params object
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    
    // NOTE: isActive is set explicitly to allow fetching active or inactive items
    // If not provided, we default to 'true' or let the backend handle the default.
    // Based on your example, we'll cast it to a string for the URL.
    if (params.isActive !== undefined) {
        query.set("isActive", String(params.isActive));
    }


    // 3. API Call
    const url = `${process.env.BACKEND_API_URL}/vaccination/get-all-vaccinations?${query.toString()}`;
    
    const response = await fetch(url, {
      method: "GET", // Matches your cURL -X 'GET'
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`, // Matches your cURL -H 'Authorization...'
        Accept: "*/*",
      },
      // Next.js specific: You might add { cache: 'no-store' } if the data changes frequently
    });

    // 4. Process Response
    const result = await response.json();

    // Check for failure (e.g., HTTP 4xx, 5xx, or a 'success: false' payload)
    if (!response.ok || !result.success) {
      throw new Error(
        result.message || `Failed to fetch vaccinations with status: ${response.status}`
      );
    }

    // 5. Successful Response
    // The response structure matches the curl result (nested data with 'vaccinations' array and 'meta')
    return {
      success: true,
      message: result.message || "Vaccinations fetched successfully",
      data: result.data,
    };
  } catch (error) {
    // 6. Error Handling
    console.error("Get All Vaccinations error:", error);

    // Provide a default error structure matching GetAllVaccinationsResponse
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching vaccinations.",
      data: {
        vaccinations: [], // Empty array on failure
        meta: {
          total: 0,
          page: params.page || 1,
          limit: params.limit || 10,
          hasNext: false,
        },
      },
    };
  }
};