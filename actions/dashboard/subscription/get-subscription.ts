"use server";

import { auth } from "@/auth";
import { SingleSubscriptionResponse } from "@/types/subscription.type";
import { cache } from "react";

export const getSubscriptionById = cache(
  async (id: string): Promise<SingleSubscriptionResponse> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      if (!id) {
        throw new Error("Subscription ID is required");
      }

      console.log("Fetching subscription by ID:", id);

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/plans/${id}`,
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
        throw new Error(result.message || "Failed to fetch subscription");
      }

      return {
        success: true,
        data: result.data,
        message: result.message || "Subscription fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      };
    }
  }
);
