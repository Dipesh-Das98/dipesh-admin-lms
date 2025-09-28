"use server";

import { auth } from "@/auth";
import { Language } from "@/config/forms/child-form-options";

export interface CreateGameData {
  title: string;
  language: Language;
  categoryId: string;
  description: string;
}

export interface CreateGameResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    description: string;
    language: Language;
    categoryId: string;
  };
}

export const createGame = async (
  data: CreateGameData
): Promise<CreateGameResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (
      !data.title ||
      !data.language ||
      !data.categoryId || !data.description
    ) {
      throw new Error("All required fields must be provided");
    }

    if (data.description.length > 500) {
      throw new Error("Description must be less than 500 characters");
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/game`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        language: data.language,
        categoryId: data.categoryId,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create game");
    }

    return {
      success: true,
      message: result.message || "Game created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create game error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

