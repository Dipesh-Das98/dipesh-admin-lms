"use server";

import { auth } from "@/auth";
import {
  Language,
  Gender,
  PARENT_ROLE,
} from "@/config/forms/child-form-options";

export interface CreateChildData {
  nickname: string;
  avatar: string;
  gender: Gender;
  language: Language;
  password: string;
  grade: string;
  parentId: string;
  parentRole: PARENT_ROLE;
}

export interface CreateChildResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export const createChild = async (
  data: CreateChildData
): Promise<CreateChildResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (
      !data.gender ||
      !data.language ||
      !data.password ||
      !data.grade ||
      !data.parentId ||
      !data.parentRole
    ) {
      throw new Error("All required fields must be provided");
    }

    // Validate password length
    if (data.password.length < 4) {
      throw new Error("Password must be at least 4 characters long");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/children/create-child-by-admin`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: data.nickname || null,
          gender: data.gender,
          avatar: data.avatar,
          language: data.language,
          password: data.password,
          grade: data.grade,
          parentId: data.parentId,
          parentRole: data.parentRole,
        }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create child account");
    }

    return {
      success: true,
      message: result.message || "Child account created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Create child error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
