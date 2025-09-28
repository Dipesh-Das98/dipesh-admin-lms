"use server";

import { auth } from "@/auth";
import { Language } from "@/config/forms/child-form-options";

export interface CreateEthicsData {
  title: string;
  description: string;
  backgroundColor: string;
  language: Language;
  categoryId: string;
}

export interface CreateEthicsResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    description: string;
    backgroundColor: string;
    grade: string;
    language: Language;
    categoryId: string;
  };
}

export const createEthics = async (
  data: CreateEthicsData
): Promise<CreateEthicsResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (
      !data.title ||
      !data.description ||
      !data.backgroundColor ||
      !data.language ||
      !data.categoryId
    ) {
      throw new Error("All required fields must be provided");
    }

    if (data.description.length > 500) {
      throw new Error("Description must be less than 500 characters");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/ethics`, {
    method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        backgroundColor: data.backgroundColor,
        language: data.language,
        categoryId: data.categoryId,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create ethics");
    }

    return {
      success: true,
      message: result.message || "Ethics created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create ethics error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
