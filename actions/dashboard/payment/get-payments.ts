"use server";

import { auth } from "@/auth";
import { PayementFilters, PaymentApiResponse } from "@/types";
import { cache } from "react";

export const getPayments = cache(
  async (filters: PayementFilters = {}): Promise<PaymentApiResponse> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      console.log("Fetching all Payments");

      const {
        page = 1,
        limit = 10,
        search,
        sortBy,
        sortOrder = "desc",
        status,
      } = filters;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortOrder,
      });

      if (search && search.trim()) {
        params.append("search", search.trim());
      }
      if (sortBy && sortBy.trim()) {
        params.append("sortBy", sortBy.trim());
      }
      if (status && status.trim()) {
        params.append("status", status.trim());
      }

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/payment?${params.toString()}`,
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
        data: {
          payments: [],
          meta: {
            total: 0,
            page: 1,
            limit: 10,
            hasNext: false,
          },
        },
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
);
