"use server";

import { auth } from "@/auth";
import {
  GetAllHelpTopicsParams,
  GetAllHelpTopicsResponse,
} from "@/types/help-topic.type";

export const getAllHelpTopics = async (
  params: GetAllHelpTopicsParams
): Promise<GetAllHelpTopicsResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const query = new URLSearchParams();

    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    if (typeof params.isActive === "boolean") {
      query.set("isActive", String(params.isActive));
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/help-topic/get-all-help-topics?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          Accept: "*/*",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch help topics");
    }

    return {
      success: true,
      message: result.message || "Help Topics fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Get All Help Topics error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: {
        helptopics: [],
        meta: {
          total: 0,
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          hasNext: false,
        },
      },
    };
  }
};
