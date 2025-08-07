"use server";

import { auth } from "@/auth";
import { MusicApiResponse } from "@/types";
import { cache } from "react";

export const getMusic = cache(
  async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ) => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      console.log("Fetching stories data with params:", {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        sessionToken: session.user.backendToken,
        backendApiUrl: process.env.BACKEND_API_URL,
        fullUrl: `${process.env.BACKEND_API_URL}/music`,
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

      const response = await fetch(
        `${
          process.env.BACKEND_API_URL
        }/music/get-all-music?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: MusicApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch music");
      }

      return data;
    } catch (error) {
      console.error("Error fetching music data:", error);
      throw error;
    }
  }
);
