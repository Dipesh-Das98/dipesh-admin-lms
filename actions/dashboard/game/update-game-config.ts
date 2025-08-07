"use server";

import { auth } from "@/auth";

// TODO - Define a proper type for gameConfig instead of using `any`
export interface UpdateGamesData {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gameConfig?: any; // For JSON gameConfig data
}

export interface UpdateGamesResponse {
  success: boolean;
  message: string;
}

export const updateGamesConfig = async (
  data: UpdateGamesData
): Promise<UpdateGamesResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }
    console.log("Updating game config with data:", data);

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/game/config/${data.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data.gameConfig
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Update game config result:", result);

    if (!result.success) {
      throw new Error(result.message || "Failed to update game");
    }

    return {
      success: true,
      message: result.message || "Game updated successfully",
    };
  } catch (error) {
    console.error("Error updating game:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update game",
    };
  }
};
