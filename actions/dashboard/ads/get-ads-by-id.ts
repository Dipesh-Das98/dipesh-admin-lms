"use server";

import { auth } from "@/auth";
import { Ads, AdsResponse } from "@/types/ads.type";
import { cache } from "react";

export const getAdById = cache(
  async (id: string): Promise<AdsResponse<Ads>> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${process.env.BACKEND_API_URL}/ads/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Payments");
      }

      return {
        success: true,
        data: result.data,
        message: result.message || "Payments fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching Payments:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
);
