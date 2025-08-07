// actions/dashboard/readAlongWith/get-all-read-along-stories.ts

"use server";

import { auth } from "@/auth";
import {
  GetAllReadAlongStoriesParams,
  GetAllReadAlongStoriesResponse,
} from "@/types/readAlongWith.types";

export const getAllReadAlongStories = async (
  params: GetAllReadAlongStoriesParams
): Promise<GetAllReadAlongStoriesResponse> => {
  try {
    const session = await auth();
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    queryParams.append("isActive", String(params.isActive)); // required

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/readAlongStories/get-all-stories?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch stories");
    }

    return {
      success: true,
      message: result.message || "Stories fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Get all read-along stories error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
      data: {
        readAlongStories: [],
        total: 0,
        page: 1,
        limit: 10,
      }
      ,
    };
  }
};
