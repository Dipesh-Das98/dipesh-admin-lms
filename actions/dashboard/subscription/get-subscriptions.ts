"use server";

import { auth } from "@/auth";
import { SubscriptionResponse } from "@/types/subscription.type";
import { cache } from "react";

export const getSubscriptions = cache(
  async (): Promise<SubscriptionResponse> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      console.log("Fetching all subscriptions");

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/plans`,
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
        throw new Error(result.message || "Failed to fetch subscriptions");
      }

      return {
        success: true,
        data: result.data,
        message: result.message || "Subscriptions fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      };
    }
  }
);
