"use server";

import { auth } from "@/auth";
import {
  GetPushNotificationTemplateResponse,
  // Assuming PushNotificationTemplate is imported
} from "@/types/push-notification.type";

/**
 * Fetches a single push notification template by ID using a GET request.
 * The template ID is passed as a path parameter.
 * @param {string} id The unique ID of the template to retrieve.
 * @returns {Promise<GetPushNotificationTemplateResponse>} The API response, containing the template data on success.
 */
export const getPushNotificationTemplate = async (
  id: string
): Promise<GetPushNotificationTemplateResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const endpoint = `/push-notification-template/get-push-notification-template/${id}`;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}${endpoint}`,
      {
        method: "GET", // Using GET as specified
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
        // GET requests do not have a body
      }
    );

    const result = await response.json();

    // Check for non-OK response (e.g., 404 Not Found) or backend-reported failure
    if (!response.ok || !result.success) {
      throw new Error(result.message || `Failed to fetch template with ID: ${id}`);
    }

    return {
      success: true,
      message: result.message || "Push Notification Template fetched successfully",
      data: result.data, // Data is the template object itself
    };
  } catch (error) {
    console.error(`Get Push Notification Template (${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during template retrieval",
    };
  }
};