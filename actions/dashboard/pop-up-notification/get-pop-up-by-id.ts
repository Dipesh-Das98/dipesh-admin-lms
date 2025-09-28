"use server";

import { auth } from "@/auth";
import {
  GetPopupNotificationTemplateResponse,
} from "@/types/popup-notification.type";

/**
 * Fetches a single pop-up notification template by ID using a GET request.
 * The template ID is passed as a path parameter.
 * @param {string} id The unique ID of the template to retrieve.
 * @returns {Promise<GetPopupNotificationTemplateResponse>} The API response, containing the template data on success.
 */
export const getPopupNotificationTemplate = async (
  id: string
): Promise<GetPopupNotificationTemplateResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const endpoint = `/popup-notification-template/get-popup-notification-template/${id}`;

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
      message: result.message || "Pop-up Notification Template fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error(`Get Pop-up Notification Template (${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during template retrieval",
    };
  }
};
