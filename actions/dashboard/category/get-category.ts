"use server";

import { auth } from "@/auth";
import { Category } from "@/types";
export interface GetCategoryByIdResponse {
  success: boolean;
  data?: Category[];
  message: string;
}

export async function getCategoryByType(type: string) {
  try {
    const session = await auth();
    console.log("Fetching categories of type:", type);
    if (!session || !session.user || !session.user.backendToken) {
      throw new Error("Unauthorized access");
    }
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/categories/type/` + type,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const { data } = await response.json();
    console.log("Fetched categories:");
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
