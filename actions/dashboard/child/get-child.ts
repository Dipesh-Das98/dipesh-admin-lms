"use server";

import { auth } from "@/auth";
import { child, ChildApiResponse } from "@/types";

import { cache } from "react";

interface GetChildResponse {
  success: boolean;
  message: string;
  data?: child;
}

export async function getChild(childId: string): Promise<GetChildResponse> {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/children/${childId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || "Child data fetched successfully",
      data: data.data as child,
    };
  } catch (error) {
    console.error("Error fetching child data:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch child data",
    };
  }
}

export const getChildren = cache(
  async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortOrder?: "asc" | "desc"
  ) => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      console.log("Fetching children data with params:", {
        page,
        limit,
        search,
        sortOrder,
        sessionToken: session.user.backendToken,
        backendApiUrl: process.env.BACKEND_API_URL,
        fullUrl: `${process.env.BACKEND_API_URL}/children/get-all-children`,
      });

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortOrder: sortOrder || "desc",
      });

      if (search && search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/children/get-all-children?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );

  

      const data: ChildApiResponse = await response.json();
      console.log("Fetched children data:", data);

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch children");
      }

      return data;
    } catch (error) {
      console.error("Error fetching children data:", error);
      throw error;
    }
  }
);
