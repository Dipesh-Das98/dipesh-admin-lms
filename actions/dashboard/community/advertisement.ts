"use server";

import { auth } from "@/auth";
import { cache } from "react";

export interface Advertisement {
  id: string;
  title: string;
  mediaUrl: string;
  redirectUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdvertisementsMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface GetAdvertisementsResponse {
  success: boolean;
  message: string;
  data: {
    advertisements: Advertisement[];
    meta: GetAdvertisementsMeta;
  };
}

export const getAdvertisements = cache(
  async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<GetAdvertisementsResponse> => {
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
        }/community/get-all-advertisements?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get advertisements");
      }

      return {
        success: true,
        message: result.message || "Advertisements fetched successfully",
        data: {
          advertisements: result.data?.advertisements || [],
          meta: result.data?.meta || {
            total: 0,
            page: 1,
            limit: 10,
            hasNext: false,
          },
        },
      };
    } catch (error) {
      console.error("Error getting advertisements:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get advertisements",
        data: {
          advertisements: [],
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

export interface CreateAdvertisementData {
  title: string;
  mediaUrl: string;
  redirectUrl: string;
  isActive: boolean;
}

export interface CreateAdvertisementResponse {
  success: boolean;
  message: string;
  data?: Advertisement;
}

export interface UpdateAdvertisementData {
  id: string;
  title?: string;
  mediaUrl?: string;
  redirectUrl?: string;
  isActive?: boolean;
}

export interface UpdateAdvertisementResponse {
  success: boolean;
  message: string;
  data?: Advertisement;
}

export const createAdvertisement = async (
  data: CreateAdvertisementData
): Promise<CreateAdvertisementResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/create-advertisement`,
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
      throw new Error(result.message || "Failed to create advertisement");
    }

    return {
      success: true,
      message: result.message || "Advertisement created successfully",
      data: result.data?.data,
    };
  } catch (error) {
    console.error("Error creating advertisement:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create advertisement",
    };
  }
};

export const updateAdvertisement = async (
  data: UpdateAdvertisementData
): Promise<UpdateAdvertisementResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Prepare update payload (only include fields that are defined)
    const updatePayload: Partial<UpdateAdvertisementData> = {};

    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.mediaUrl !== undefined) updatePayload.mediaUrl = data.mediaUrl;
    if (data.redirectUrl !== undefined)
      updatePayload.redirectUrl = data.redirectUrl;
    if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/update-advertisement/${data.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update advertisement");
    }

    return {
      success: true,
      message: result.message || "Advertisement updated successfully",
      data: result.data?.data,
    };
  } catch (error) {
    console.error("Error updating advertisement:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update advertisement",
    };
  }
};

export const deleteAdvertisement = cache(async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/delete-advertisement/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete advertisement");
    }

    return {
      success: true,
      message: result.message || "Advertisement deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete advertisement",
    };
  }
});
