"use server";

import { auth } from "@/auth";
import { cache } from "react";

export interface PostCategory {
  id: string;
  name: string;
  iconUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetPostCategoriesMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface GetPostCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    categories: PostCategory[];
    meta: GetPostCategoriesMeta;
  };
}

export interface CreatePostCategoryData {
  name: string;
  iconUrl: string;
}

export interface CreatePostCategoryResponse {
  success: boolean;
  message: string;
  data?: PostCategory;
}

export interface UpdatePostCategoryData {
  id: string;
  name?: string;
  iconUrl?: string;
  isActive?: boolean;
}

export interface UpdatePostCategoryResponse {
  success: boolean;
  message: string;
  data?: PostCategory;
}

export const createPostCategory = async (
  data: CreatePostCategoryData
): Promise<CreatePostCategoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/create-post-category`,
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
      throw new Error(result.message || "Failed to create post category");
    }

    return {
      success: true,
      message: result.message || "Post category created successfully",
      data: result.data?.data,
    };
  } catch (error) {
    console.error("Error creating post category:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create post category",
    };
  }
};

export const updatePostCategory = async (
  data: UpdatePostCategoryData
): Promise<UpdatePostCategoryResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Prepare update payload (only include fields that are defined)
    const updatePayload: Partial<UpdatePostCategoryData> = {};

    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.iconUrl !== undefined) updatePayload.iconUrl = data.iconUrl;
    if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/update-post-category/${data.id}`,
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
      throw new Error(result.message || "Failed to update post category");
    }

    return {
      success: true,
      message: result.message || "Post category updated successfully",
      data: result.data?.data,
    };
  } catch (error) {
    console.error("Error updating post category:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update post category",
    };
  }
};

export const deletePostCategory = cache(async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/delete-post-category/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete post category");
    }

    return {
      success: true,
      message: result.message || "Post category deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting post category:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete post category",
    };
  }
});

export const getPostCategories = cache(
  async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<GetPostCategoriesResponse> => {
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
        }/community/get-all-post-categories?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get post categories");
      }

      return {
        success: true,
        message: result.message || "Post categories fetched successfully",
        data: {
          categories: result.data?.categories || [],
          meta: result.data?.meta || {
            total: 0,
            page: 1,
            limit: 10,
            hasNext: false,
          },
        },
      };
    } catch (error) {
      console.error("Error getting post categories:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get post categories",
        data: {
          categories: [],
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
