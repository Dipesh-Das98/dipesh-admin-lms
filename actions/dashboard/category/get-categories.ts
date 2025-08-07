"use server";

import { auth } from "@/auth";
import { CategoryApiResponse } from "@/types/category.type";
import { cache } from "react";

export const getCategories = cache(
  async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    type?: string,
    isPublished?: boolean,
    language?: string
  ) => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      console.log("Fetching categories data with params:", {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        type,
        isPublished,
        language,
        sessionToken: session.user.backendToken,
        backendApiUrl: process.env.BACKEND_API_URL,
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

      if (type && type.trim()) {
        params.append("activity", type.trim());
      }

      if (language && language.trim()) {
        params.append("language", language.trim());
      }

      if (isPublished !== undefined) {
        params.append("isPublished", isPublished.toString());
      }

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/categories/get-all-categories?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: CategoryApiResponse = await response.json();
      console.log("Categories data fetched successfully:", data);
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      return data;
    } catch (error) {
      console.error("Error fetching categories data:", error);
      throw error;
    }
  }
);
