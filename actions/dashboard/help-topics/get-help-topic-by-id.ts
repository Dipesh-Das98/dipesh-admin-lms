"use server";

import { auth } from "@/auth";
import {
    GetSingleHelpTopicResponse
} from "@/types/help-topic.type";

export const getHelpTopic = async (
  id: string,
): Promise<GetSingleHelpTopicResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/help-topic/get-help-topic/${id}`,
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
      throw new Error(result.message || "Failed to fetch help topic");
    }

    return {
      success: true,
      message: result.message || "Help Topic fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Get Help Topic error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
