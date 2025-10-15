"use server";

import { auth } from "@/auth";
import {
  CreateHelpTopicData,
  CreateHelpTopicResponse,
} from "@/types/help-topic.type";

export const createHelpTopic = async (
  data: CreateHelpTopicData
): Promise<CreateHelpTopicResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/help-topic/create-help-topic`,
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
      throw new Error(result.message || "Failed to create help topic");
    }

    return {
      success: true,
      message: result.message || "Help Topic created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create Help Topic error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
