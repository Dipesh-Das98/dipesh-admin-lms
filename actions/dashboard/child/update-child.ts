"use server";

import { auth } from "@/auth";
import {
  Language,
  Gender,
  PARENT_ROLE,
} from "@/config/forms/child-form-options";

export interface UpdateChildData {
  nickname?: string;
  avatar?: string;
  gender: Gender;
  language: Language;
  grade: string;
  parentId: string;
  parentRole: PARENT_ROLE;
}

export interface UpdateChildResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export const updateChild = async (
  childId: string,
  data: UpdateChildData
): Promise<UpdateChildResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/children/${childId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: data.nickname || null,
          avatar: data.avatar || null,
          gender: data.gender,
          language: data.language,
          grade: data.grade,
          parentId: data.parentId,
          parentRole: data.parentRole,
        }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update child account");
    }

    return {
      success: true,
      message: result.message || "Child account updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Update child error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
