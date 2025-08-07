"use server";

import { auth } from "@/auth";
import { Game } from "@/types/game.type";
import { cache } from "react";

export interface GetGameByIdResponse {
  success: boolean;
  data?: Game;
  message: string;
}

export const getGameById = cache(async (id: string): Promise<GetGameByIdResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!id) {
      throw new Error("Game ID is required");
    }

    console.log("Fetching game by ID:", id);

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/game/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch game");
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Game fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching game by ID:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch game",
    };
  }
});
