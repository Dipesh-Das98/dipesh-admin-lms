"use server";

import { auth } from "@/auth";
import { AdminApiResponse } from "@/types";
import { cache } from "react";

export const getAdmins = cache(
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

      if (session.user.role !== "SUPER_ADMIN") {
        throw new Error("You are not authorized to fetch admins");
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortOrder: sortOrder || "desc",
      });

      // Add sort field if provided
      if (sortBy) {
        params.append("sortBy", sortBy);
      }

      // Add search parameter if provided
      if (search && search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(
        `${
          process.env.BACKEND_API_URL
        }/auth/admin/get-all-admin?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AdminApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch admins");
      }

      return data;
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw error;
    }
  }
);
