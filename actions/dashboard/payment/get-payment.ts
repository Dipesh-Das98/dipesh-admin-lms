"use server";

import { auth } from "@/auth";
import { Payment, PaymentResponse } from "@/types";
import { cache } from "react";

export const getSubscriptionById = cache(
  async (id: string): Promise<PaymentResponse<Payment>> => {
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
        `${process.env.BACKEND_API_URL}/payment/${id}`,
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
        throw new Error(result.message || "Failed to fetch Payment");
      }

      return {
        success: true,
        data: result.data,
        message: result.message || "Payment fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching Payment:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      };
    }
  }
);
