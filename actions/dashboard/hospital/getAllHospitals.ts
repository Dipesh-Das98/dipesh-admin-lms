// actions/hospital/getAllHospitals.ts
"use server";

import { auth } from "@/auth";
import {
  GetAllHospitalsResponse,
  GetAllHospitalsData,
  PaginationParams
} from "@/types/hospital.type"; // Import hospital-specific types

// Define a default empty state for the data on failure
const defaultFailureData: GetAllHospitalsData = {
    hospitals: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      hasNext: false,
    },
};

/**
 * Fetches a paginated, filterable list of hospital records.
 * @param params - Pagination, search, and sort parameters.
 * @returns A promise resolving to the list of hospital records and metadata.
 */
export const getAllHospitals = async (
  params: PaginationParams = {}
): Promise<GetAllHospitalsResponse> => {
  try {
    // 1. Authentication and Token Check
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token available.");
    }

    // 2. Construct Query Parameters
    const query = new URLSearchParams();

    // Dynamically set query parameters
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    
    // Convert boolean isActive to string 'true'/'false' for the URL
    if (params.isActive !== undefined) {
        query.set("isActive", String(params.isActive));
    }


    // 3. API Call
    const url = `${process.env.BACKEND_API_URL}/hospital/get-all-hospitals?${query.toString()}`;
    
    const response = await fetch(url, {
      method: "GET", // Matches your cURL -X 'GET'
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`, // Matches your cURL -H 'Authorization...'
        Accept: "*/*",
      },
      // Optionally add cache control: { cache: 'no-store' }
    });

    // 4. Process Response
    const result = await response.json();

    // Check for failure (e.g., HTTP 4xx, 5xx, or a 'success: false' payload)
    if (!response.ok || !result.success) {
      throw new Error(
        result.message || `Failed to fetch hospitals with status: ${response.status}`
      );
    }

    // 5. Successful Response
    // The response structure matches the curl result (nested data with 'hospitals' array and 'meta')
    return {
      success: true,
      message: result.message || "Hospitals fetched successfully",
      data: result.data, // This contains { hospitals: HospitalRecord[], meta: PaginationMeta }
    };
  } catch (error) {
    // 6. Error Handling
    console.error("Get All Hospitals error:", error);

    // Get the current page and limit from params for the error response meta
    const currentPage = params.page || 1;
    const currentLimit = params.limit || 10;
    
    // Provide an error structure matching GetAllHospitalsResponse
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching hospitals.",
      data: {
        ...defaultFailureData, // Start with default meta and empty array
        meta: {
            ...defaultFailureData.meta,
            page: currentPage,
            limit: currentLimit
        }
      },
    };
  }
};