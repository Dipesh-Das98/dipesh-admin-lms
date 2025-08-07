"use server";

import { auth } from "@/auth";
import {
  GetAllFamilyHealthCoursesParams,
  GetAllFamilyHealthCoursesResponse,
} from "@/types/familyHealth.types";

export const getAllFamilyHealthCourses = async (
  params: GetAllFamilyHealthCoursesParams
): Promise<GetAllFamilyHealthCoursesResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const query = new URLSearchParams();

    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    query.set("isActive", String(params.isActive));

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/family-health-course/get-all-courses?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          Accept: "*/*",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch courses");
    }

    return {
      success: true,
      message: result.message || "Courses fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Get All Family Health Courses error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: {
        familyHealthCourse: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          hasNext: false,
        },
      },
    };
  }
};

