"use server";

import { auth } from "@/auth";
import { cache } from "react";

export interface MakeModeratorData {
  userId: string;
}

export interface MakeModeratorResponse {
  success: boolean;
  message: string;
  data?: Moderator;
}

export interface RemoveModeratorResponse {
  success: boolean;
  message: string;
}

export interface BanUserData {
  banType: "TEMPORARY_BAN" | "PERMANENT_BAN";
}

export interface BanUserResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    username: string;
    banType: string;
    bannedAt: string;
    bannedBy: string;
    expiresAt?: string;
  };
}

export interface UnbanUserResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    username: string;
    unbannedAt: string;
    unbannedBy: string;
  };
}

export interface Moderator {
  id: string;
  parentId: string;
  username: string;
  email: string;
  assignedAt: string;
  isActive: boolean;
  actionsCount: number;
  banStatus: boolean;
}

export interface GetModeratorsMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface GetModeratorsResponse {
  success: boolean;
  message: string;
  data: {
    data: Moderator[];
    meta: GetModeratorsMeta;
  };
}

export const makeModerator = async (
  data: MakeModeratorData
): Promise<MakeModeratorResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/admin/community/moderators`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to make moderator");
    }

    return {
      success: true,
      message: result.message || "Moderator made successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error making moderator:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to make moderator",
    };
  }
};

export const removeModerator = async (
  userId: string
): Promise<RemoveModeratorResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/admin/community/moderators/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete moderator");
    }

    return {
      success: true,
      message: result.message || "Moderator deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting moderator:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete moderator",
    };
  }
};

export const getModerators = cache(
  async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<GetModeratorsResponse> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
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
        }/admin/community/moderators?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get moderators");
      }

      return {
        success: true,
        message: result.message || "Moderators fetched successfully",
        data: {
          data: result.data?.data || [],
          meta: result.data?.meta || {
            total: 0,
            page: 1,
            limit: 10,
            hasNext: false,
          },
        },
      };
    } catch (error) {
      console.error("Error getting moderators:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get moderators",
        data: {
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: 10,
            hasNext: false,
          },
        },
      };
    }
  }
);

export const banUser = async (
  userId: string,
  data: BanUserData
): Promise<BanUserResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/moderation/users/${userId}/ban`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to ban user");
    }

    return {
      success: true,
      message: result.message || "User banned successfully",
      data: result.data?.data,
    };
  } catch (error) {
    console.error("Error banning user:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to ban user",
    };
  }
};

export const unbanUser = async (userId: string): Promise<UnbanUserResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/moderation/users/${userId}/unban`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to unban user");
    }

    return {
      success: true,
      message: result.message || "User unbanned successfully",
      data: result.data?.data,
    };
  } catch (error) {
    console.error("Error unbanning user:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to unban user",
    };
  }
};
