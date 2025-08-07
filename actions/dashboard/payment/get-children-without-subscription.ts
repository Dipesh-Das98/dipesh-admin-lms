"use server";

import { auth } from "@/auth";
import { ChildSubscriptionResponse } from "@/types";
import { cache } from "react";

export const getChildSubscriptionByParentId = cache(
  async (id: string): Promise<ChildSubscriptionResponse> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      if (!id) {
        throw new Error("Payment ID is required");
      }

      console.log("Fetching Payment by ID:", id);

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/payment/get-subscription-by-parent/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      return {
        success: true,
        children: result.children,
        availablePlans: result.availablePlans,
      };
    } catch (error) {
      console.error("Error fetching Payment:", error);
      return {
        success: false,
        message: "Somethig went wrong try again",
      };
    }
  }
);
