"use server";

import { auth } from "@/auth";
import { Course } from "@/types/course.type";
import { cache } from "react";

export interface GetCourseResponse {
  success: boolean;
  data?: Course;
  message: string;
}

export const getCourseById = cache(
  async (id: string): Promise<GetCourseResponse> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      if (!id) {
        throw new Error("Course ID is required");
      }

      console.log("Fetching course by ID:", id);

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/course/get-course/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch course");
      }

      return {
        success: true,
        data: result.data,
        message: result.message || "Course fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching course by ID:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch course",
      };
    }
  }
);
