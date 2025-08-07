"use server";

import { auth } from "@/auth";
import { Chapter } from "@/types";
import { cache } from "react";

export interface GetChpaterResponse {
  success: boolean;
  data?: Chapter;
  message: string;
}

export const getChapterById = cache(
  async (id: string): Promise<GetChpaterResponse> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      if (!id) {
        throw new Error("Chpater ID is required");
      }

      console.log("Fetching chapter by ID:", id);

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/course/get-chapter/${id}`,
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
        throw new Error(result.message || "Failed to fetch chapter");
      }

      // is assignment is not null, we need to add the assignment property to the chapter
      if (result.data && result.data.assignments) {
        result.data.assignments.questions = JSON.parse(
          result.data.assignments.questions || "[]"
        );
      }

      return {
        success: true,
        data: result.data,
        message: result.message || "Chapter fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching chpater by ID:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch chapter",
      };
    }
  }
);
