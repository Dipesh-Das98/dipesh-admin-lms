"use server";

import { auth } from "@/auth";
import { LibraryApiResponse, LibraryFilters } from "@/types";
import { cache } from "react";

export const getLibraries = cache(
  async (filters: LibraryFilters = {}) => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      const {
        page = 1,
        limit = 10,
        search,
        sortBy,
        sortOrder = "desc",
        grade,
        language,
      } = filters;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortOrder,
      });

      if (search && search.trim()) {
        params.append("search", search.trim());
      }

      if (sortBy && sortBy.trim()) {
        params.append("sortBy", sortBy.trim());
      }

      if (grade && grade.trim()) {
        params.append("grade", grade.trim());
      }

      if (language) {
        params.append("language", language);
      }

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/library/get-all-libraries?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: LibraryApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch libraries");
      }

      return data;
    } catch (error) {
      console.error("Error fetching libraries data:", error);
      throw error;
    }
  }
); 