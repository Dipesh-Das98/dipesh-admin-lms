"use server";

import { auth } from "@/auth";
import {
  UpdateHelpTopicData,
  UpdateHelpTopicResponse,
} from "@/types/help-topic.type";

export const updateHelpTopic = async (
  id: string,
  data: UpdateHelpTopicData
): Promise<UpdateHelpTopicResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/help-topic/update-help-topic/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update help topic");
    }

    return {
      success: true,
      message: result.message || "Help Topic updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Update Help Topic error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
