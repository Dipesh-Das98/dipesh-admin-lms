"use server";

import { auth } from "@/auth";
import { EthicsApiResponse } from "@/types/ethics.type";
import { cache } from "react";

export const getEthics = cache(
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

      console.log("Fetching ethics data with params:", {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        category,
        language,
        sessionToken: session.user.backendToken,
        backendApiUrl: process.env.BACKEND_API_URL,
        fullUrl: `${process.env.BACKEND_API_URL}/ethics`,
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
        }/ethics/get-all-ethics?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: EthicsApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch ethics");
      }

      return data;
    } catch (error) {
      console.error("Error fetching ethics data:", error);
      throw error;
    }
  }
);
