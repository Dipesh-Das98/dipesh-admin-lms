"use server";

import { auth } from "@/auth";
import {
  GetAllPushNotificationTemplatesParams,
  GetAllPushNotificationTemplatesResponse,
  PushNotificationTemplate, 
  PaginationMeta,
} from "@/types/push-notification.type";

/**
 * Fetches a list of push notification templates with optional pagination and filtering.
 * @param {GetAllPushNotificationTemplatesParams} params Query parameters (page, limit, sortOrder, etc.).
 * @returns {Promise<GetAllPushNotificationTemplatesResponse>} The API response, containing the list and metadata on success.
 */
export const getAllPushNotificationTemplates = async (
  params: GetAllPushNotificationTemplatesParams
): Promise<GetAllPushNotificationTemplatesResponse> => {
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

    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);


    const endpoint = `/push-notification-template/get-all-push-notification-templates?${query.toString()}`;

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
      throw new Error(result.message || "Failed to fetch push notification templates");
    }

    return {
      success: true,
      message: result.message || "Push Notification Templates fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Get All Push Notification Templates error:", error);

    // Return a structured failure response with empty data arrays
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: {
        pushNotificationTemplates: [],
        meta: defaultMeta,
      },
    };
  }
};