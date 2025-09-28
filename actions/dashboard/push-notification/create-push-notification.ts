"use server";

import { auth } from "@/auth";
import {
  CreatePushNotificationTemplateData,
  CreatePushNotificationTemplateResponse,
} from "@/types/push-notification.type";

/**
 * Creates a new push notification template by making a POST request to the backend API.
 * This function handles authentication, request body serialization, and error handling.
 * @param {CreatePushNotificationTemplateData} data The payload for the new template.
 * @returns {Promise<CreatePushNotificationTemplateResponse>} The API response, including success status and a message.
 */
export const createPushNotificationTemplate = async (
  data: CreatePushNotificationTemplateData
): Promise<CreatePushNotificationTemplateResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/push-notification-template/create-push-notification-template`,
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
    console.log(result);

    // Check for non-OK response (e.g., 409 Conflict) or backend-reported failure
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create push notification template");
    }

    return {
      success: true,
      message: result.message || "Push Notification Template created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create Push Notification Template error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
};
