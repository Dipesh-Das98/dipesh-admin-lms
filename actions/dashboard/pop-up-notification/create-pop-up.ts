"use server";

import { auth } from "@/auth";
import {
  CreatePopupNotificationTemplateData,
  CreatePopupNotificationTemplateResponse,
} from "@/types/popup-notification.type";

/**
 * Creates a new pop-up notification template by making a POST request to the backend API.
 * @param {CreatePopupNotificationTemplateData} data The payload for the new template.
 * @returns {Promise<CreatePopupNotificationTemplateResponse>} The API response, including success status and a message.
 */
export const createPopupNotificationTemplate = async (
  data: CreatePopupNotificationTemplateData
): Promise<CreatePopupNotificationTemplateResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const endpoint = "/popup-notification-template/create-popup-notification-template";

    const response = await fetch(
      `${process.env.BACKEND_API_URL}${endpoint}`,
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

    // Check for non-OK response or backend-reported failure
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create pop-up notification template");
    }

    return {
      success: true,
      message: result.message || "Popup Notification Template created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create Pop-up Notification Template error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during template creation",
    };
  }
};