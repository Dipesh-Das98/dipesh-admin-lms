"use server";

import { auth } from "@/auth";
import {
  UpdatePushNotificationTemplateData,
  UpdatePushNotificationTemplateResponse,
} from "@/types/push-notification.type";

/**
 * Updates an existing push notification template by making a PATCH request to the backend API.
 * The template ID is passed as a path parameter.
 * @param {string} id The unique ID of the template to be updated.
 * @param {UpdatePushNotificationTemplateData} data The payload containing the fields to update.
 * @returns {Promise<UpdatePushNotificationTemplateResponse>} The API response.
 */
export const updatePushNotificationTemplate = async (
  id: string,
  data: UpdatePushNotificationTemplateData
): Promise<UpdatePushNotificationTemplateResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const endpoint = `/push-notification-template/update-push-notification-template/${id}`;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}${endpoint}`,
      {
        method: "PATCH", // Using PATCH as specified
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
      throw new Error(result.message || `Failed to update template with ID: ${id}`);
    }

    return {
      success: true,
      message: result.message || "Push Notification Template updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error(`Update Push Notification Template (${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during template update",
    };
  }
};