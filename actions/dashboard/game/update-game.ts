"use server";

import { auth } from "@/auth";
import { Language } from "@/config/forms/child-form-options";

export interface UpdateGamesData {
  id: string;
  title?: string;
  description?: string;
  instructions?: string;
  categoryId?: string;
  timePerLevel?: number;
  backgroundColor?: string;
  language?: Language;
  thumbnail?: string;
  gameConfig?: unknown; // For JSON gameConfig data
}

export interface UpdateGamesResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    description: string;
    instructions?: string;
    categoryId: string;
    timePerLevel?: number;
    backgroundColor?: string;
    language: Language;
  };
}

export const updateGames = async (
  data: UpdateGamesData
): Promise<UpdateGamesResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (!data.id) {
      throw new Error("Game ID is required");
    }

    // Validate optional fields if provided
    if (data.title && data.title.length > 100) {
      throw new Error("Title must be less than 100 characters");
    }

    if (data.description && data.description.length > 500) {
      throw new Error("Description must be less than 500 characters");
    }

    if (data.instructions && data.instructions.length > 1000) {
      throw new Error("Instructions must be less than 1000 characters");
    }

    if (data.timePerLevel && (data.timePerLevel < 1 || data.timePerLevel > 3600)) {
      throw new Error("Time per level must be between 1 and 3600 seconds");
    }

    console.log("Updating game with data:", data);

    const response = await fetch(`${process.env.BACKEND_API_URL}/game/${data.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        categoryId: data.categoryId,
        timePerLevel: data.timePerLevel,
        backgroundColor: data.backgroundColor,
        language: data.language,
        thumbnail: data.thumbnail,
        gameConfig: data.gameConfig, // Include gameConfig in the update
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update game");
    }

    return {
      success: true,
      message: result.message || "Game updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating game:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update game",
    };
  }
};
