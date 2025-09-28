"use server";

import { auth } from "@/auth";
import { cache } from "react";

export const getAds = cache(
  async () => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      console.log("Fetching all ads");

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/ads`,
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
        data: [],
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
);
