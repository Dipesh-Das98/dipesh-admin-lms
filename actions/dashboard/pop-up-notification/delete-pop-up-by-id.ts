"use server";

import { auth } from "@/auth";
import {
  DeletePopupNotificationTemplateResponse,
} from "@/types/popup-notification.type";

/**
 * Deletes a pop-up notification template by making a DELETE request to the backend API.
 * The template ID is passed as a path parameter.
 * @param {string} id The unique ID of the template to be deleted.
 * @returns {Promise<DeletePopupNotificationTemplateResponse>} The API response.
 */
export const deletePopupNotificationTemplate = async (
  id: string
): Promise<DeletePopupNotificationTemplateResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const endpoint = `/popup-notification-template/delete-popup-notification-template/${id}`;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}${endpoint}`,
      {
        method: "DELETE", // Using DELETE as specified
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
        // No body is sent with this DELETE request
      }
    );

    const result = await response.json();

    // Check for non-OK response (e.g., 404 Not Found) or backend-reported failure
    if (!response.ok || !result.success) {
      throw new Error(result.message || `Failed to delete pop-up template with ID: ${id}`);
    }

    return {
      success: true,
      message: result.message || "Popup Notification Template deleted successfully",
      data: result.data,
    };
  } catch (error) {
    console.error(`Delete Pop-up Notification Template (${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during template deletion",
    };
  }
};