"use server";

import { auth } from "@/auth";
import { cache } from "react";
import {
  CommunityDashboardResponse,
  ReportsResponse,
  CategoryAnalyticsResponse,
  TrendingDiscussion,
  UserAnalytics,
} from "@/types/community-dashboard.type";

// Get comprehensive dashboard data
export const getCommunityDashboard = cache(
  async (): Promise<{
    success: boolean;
    message: string;
    data?: CommunityDashboardResponse;
  }> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/community/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get dashboard data");
      }

      return {
        success: true,
        message: result.message || "Dashboard data fetched successfully",
        data: result.data,
      };
    } catch (error) {
      console.error("Error getting community dashboard:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get dashboard data",
      };
    }
  }
);

// Get detailed reports for moderation
export const getCommunityReports = cache(
  async (
    page: number = 1,
    limit: number = 10
  ): Promise<{
    success: boolean;
    message: string;
    data?: ReportsResponse;
  }> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `${
          process.env.BACKEND_API_URL
        }/community/dashboard/reports?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get reports");
      }

      return {
        success: true,
        message: result.message || "Reports fetched successfully",
        data: result.data,
      };
    } catch (error) {
      console.error("Error getting community reports:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get reports",
      };
    }
  }
);

// Get category analytics
export const getCategoryAnalytics = cache(
  async (): Promise<{
    success: boolean;
    message: string;
    data?: CategoryAnalyticsResponse;
  }> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/community/dashboard/categories/analytics`,
        {
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get category analytics");
      }

      return {
        success: true,
        message: result.message || "Category analytics fetched successfully",
        data: result.data,
      };
    } catch (error) {
      console.error("Error getting category analytics:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get category analytics",
      };
    }
  }
);

// Get trending discussions
export const getTrendingDiscussions = cache(
  async (
    limit: number = 10
  ): Promise<{
    success: boolean;
    message: string;
    data?: TrendingDiscussion[];
  }> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      const response = await fetch(
        `${
          process.env.BACKEND_API_URL
        }/community/dashboard/trending?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get trending discussions");
      }

      return {
        success: true,
        message: result.message || "Trending discussions fetched successfully",
        data: result.data,
      };
    } catch (error) {
      console.error("Error getting trending discussions:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get trending discussions",
      };
    }
  }
);

// Get user analytics
export const getUserAnalytics = cache(
  async (): Promise<{
    success: boolean;
    message: string;
    data?: UserAnalytics;
  }> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/community/dashboard/user-analytics`,
        {
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get user analytics");
      }

      return {
        success: true,
        message: result.message || "User analytics fetched successfully",
        data: result.data,
      };
    } catch (error) {
      console.error("Error getting user analytics:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get user analytics",
      };
    }
  }
);
