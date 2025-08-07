"use server";

import { auth } from "@/auth";
import { LanguageCornerApiResponse } from "@/types/language.type";
import { cache } from "react";

export const getLanguageCorner = cache(
  async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    category?: string,
    language?: string
  ) => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      console.log("Fetching language corner data with params:", {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        category,
        language,
        sessionToken: session.user.backendToken,
        backendApiUrl: process.env.BACKEND_API_URL,
        fullUrl: `${process.env.BACKEND_API_URL}/language-corner`,
      });

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortOrder: sortOrder || "desc",
      });

      if (search && search.trim()) {
        params.append("search", search.trim());
      }

      if (sortBy && sortBy.trim()) {
        params.append("sortBy", sortBy.trim());
      }

      if (category && category.trim()) {
        params.append("category", category.trim());
      }

      if (language && language.trim()) {
        params.append("language", language.trim());
      }
      const response = await fetch(
        `${
          process.env.BACKEND_API_URL
        }/language-corner/get-all-language-corner?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: LanguageCornerApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch language corner");
      }

      return data;
    } catch (error) {
      console.error("Error fetching language corner data:", error);
      throw error;
    }
  }
);
