"use server";

import { auth } from "@/auth";
import {
  GetAllPopupNotificationTemplatesParams,
  GetAllPopupNotificationTemplatesResponse,
  PaginationMeta,
} from "@/types/popup-notification.type";

/**
 * Fetches a list of pop-up notification templates with optional pagination and filtering.
 * @param {GetAllPopupNotificationTemplatesParams} params Query parameters (page, limit, search, etc.).
 * @returns {Promise<GetAllPopupNotificationTemplatesResponse>} The API response.
 */
export const getAllPopupNotificationTemplates = async (
  params: GetAllPopupNotificationTemplatesParams
): Promise<GetAllPopupNotificationTemplatesResponse> => {
  const defaultMeta: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 10,
    hasNext: false,
  };

  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // --- Build Query Parameters ---
    const query = new URLSearchParams();

    // Dynamically add parameters if they exist
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    const endpoint = `/popup-notification-template/get-all-popup-notification-templates?${query.toString()}`;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}${endpoint}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          Accept: "*/*",
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch pop-up notification templates");
    }

    return {
      success: true,
      message: result.message || "Pop-up Notification Templates fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Get All Pop-up Notification Templates error:", error);

    // Return a structured failure response with empty data array and default meta
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: {
        popupNotificationTemplates: [],
        meta: defaultMeta,
      },
    };
  }
};