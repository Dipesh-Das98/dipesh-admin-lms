"use server";

import { auth } from "@/auth";
import {
  GetAllPregnancyWeekContentParams,
  GetAllPregnancyWeekContentResponse,
  GetAllPregnancyWeekContentResponseData,
} from "@/types/pregnancy.type";

const API_BASE_URL = `${process.env.BACKEND_API_URL}/pregnancy/pregnancy-week-content`;

export const getAllPregnancyWeekContent = async (
  params: GetAllPregnancyWeekContentParams
): Promise<GetAllPregnancyWeekContentResponse> => {
  try {
    const session = await auth();
    
    // 1. Authentication Check
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // 2. Build Query Parameters (only page and limit from the cURL example)
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    // 3. API Call
    const response = await fetch(
      `${API_BASE_URL}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
        cache: "no-store", 
      }
    );

    const result = await response.json();

    // 4. API Response Success Check
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch pregnancy week content list");
    }

    // 5. Successful Return
    return {
      success: true,
      message: result.message || "Request processed successfully",
      // Data matches the GetAllPregnancyWeekContentResponseData shape { pregnancyWeekContents: [...], meta: {...} }
      data: result.data as GetAllPregnancyWeekContentResponseData, 
    };

  } catch (error) {
    console.error("Get all pregnancy week content error:", error);

    // 6. Error Handling (returning empty data structure for safety)
    const emptyData: GetAllPregnancyWeekContentResponseData = {
        pregnancyWeekContents: [],
        meta: {
            total: 0,
            page: params.page || 1,
            limit: params.limit || 10,
            hasNext: false,
        }
    };

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
      data: emptyData,
    };
  }
};