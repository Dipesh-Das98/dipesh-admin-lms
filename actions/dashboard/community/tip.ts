"use server";

import { auth } from "@/auth";
import { cache } from "react";

export type TargetType = "ALL" | "PARENT";

export interface Tip {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorDesignation: string;
  isActive: boolean;
  targetType: TargetType;
  grade: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTipsMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface GetTipsResponse {
  success: boolean;
  message: string;
  data: {
    data: Tip[];
    meta: GetTipsMeta;
  };
}

export interface CreateTipData {
  title: string;
  content: string;
  authorName: string;
  authorDesignation: string;
  isActive: boolean;
  targetType: TargetType;
  grade: string;
}

export interface CreateTipResponse {
  success: boolean;
  message: string;
  data?: Tip;
}

export interface UpdateTipData {
  id: string;
  title?: string;
  content?: string;
  authorName?: string;
  authorDesignation?: string;
  isActive?: boolean;
  targetType?: TargetType;
  grade?: string;
}

export interface UpdateTipResponse {
  success: boolean;
  message: string;
  data?: Tip;
}

export const createTip = async (
  data: CreateTipData
): Promise<CreateTipResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/tip/create-tip`,
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
      throw new Error(result.message || "Failed to create tip");
    }

    return {
      success: true,
      message: result.message || "Tip created successfully",
      data: result.data?.data,
    };
  } catch (error) {
    console.error("Error creating tip:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create tip",
    };
  }
};

export const updateTip = async (
  data: UpdateTipData
): Promise<UpdateTipResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Prepare update payload (only include fields that are defined)
    const updatePayload: Partial<UpdateTipData> = {};

    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.content !== undefined) updatePayload.content = data.content;
    if (data.authorName !== undefined)
      updatePayload.authorName = data.authorName;
    if (data.authorDesignation !== undefined)
      updatePayload.authorDesignation = data.authorDesignation;
    if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
    if (data.targetType !== undefined)
      updatePayload.targetType = data.targetType;
    if (data.grade !== undefined) updatePayload.grade = data.grade;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/tip/update-tip/${data.id}`,
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
      throw new Error(result.message || "Failed to update tip");
    }

    return {
      success: true,
      message: result.message || "Tip updated successfully",
      data: result.data?.data,
    };
  } catch (error) {
    console.error("Error updating tip:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update tip",
    };
  }
};

export const deleteTip = cache(async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/tip/delete-tip/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete tip");
    }

    return {
      success: true,
      message: result.message || "Tip deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting tip:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete tip",
    };
  }
});

export const getTipById = cache(
  async (
    id: string
  ): Promise<{ success: boolean; message: string; data?: Tip }> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/tip/get-tip/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get tip");
      }

      return {
        success: true,
        message: result.message || "Tip fetched successfully",
        data: result.data,
      };
    } catch (error) {
      console.error("Error getting tip:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get tip",
      };
    }
  }
);

export const getTips = cache(
  async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<GetTipsResponse> => {
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
        `${process.env.BACKEND_API_URL}/tip/get-all-tips?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get tips");
      }

      return {
        success: true,
        message: result.message || "Tips fetched successfully",
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
      console.error("Error getting tips:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get tips",
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
