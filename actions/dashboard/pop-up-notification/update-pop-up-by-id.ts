"use server";

import { auth } from "@/auth";
import {
  UpdatePopupNotificationTemplateData,
  UpdatePopupNotificationTemplateResponse,
} from "@/types/popup-notification.type";

/**
 * Updates an existing pop-up notification template by making a PATCH request to the backend API.
 * The template ID is passed as a path parameter.
 * @param {string} id The unique ID of the template to update.
 * @param {Partial<UpdatePopupNotificationTemplateData>} data The payload containing the fields to update (partial update supported).
 * @returns {Promise<UpdatePopupNotificationTemplateResponse>} The API response.
 */
export const updatePopupNotificationTemplate = async (
  id: string,
  data: Partial<UpdatePopupNotificationTemplateData>
): Promise<UpdatePopupNotificationTemplateResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Construct the endpoint with the dynamic ID
    const endpoint = `/popup-notification-template/update-popup-notification-template/${id}`;

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
      message: result.message || "Popup Notification Template updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error(`Update Pop-up Notification Template (${id}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during template update",
    };
  }
};