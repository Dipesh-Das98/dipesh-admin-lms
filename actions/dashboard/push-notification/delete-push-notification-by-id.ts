"use server";

import { auth } from "@/auth";
import {
  DeletePushNotificationTemplateResponse,
} from "@/types/push-notification.type";

/**
 * Deletes a push notification template by making a DELETE request to the backend API.
 * The template ID is passed as a path parameter.
 * @param {string} id The unique ID of the template to be deleted.
 * @returns {Promise<DeletePushNotificationTemplateResponse>} The API response.
 */
export const deletePushNotificationTemplate = async (
  id: string
): Promise<DeletePushNotificationTemplateResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const endpoint = `/push-notification-template/delete-push-notification-template/${id}`;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}${endpoint}`,
      {
        method: "DELETE", // Using DELETE as specified
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
        // DELETE requests typically do not have a body
      }
    );

    const result = await response.json();

    // Check for non-OK response (e.g., 404 Not Found) or backend-reported failure
    if (!response.ok || !result.success) {
      throw new Error(result.message || `Failed to delete template with ID: ${id}`);
    }

    return {
      success: true,
      message: result.message || "Push Notification Template deleted successfully",
      // Data field is optional for success, but including the backend data structure for consistency
      data: result.data, 
    };
  } catch (error) {
    console.error(`Delete Push Notification Template (${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during template deletion",
    };
  }
};