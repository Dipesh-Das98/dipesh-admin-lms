"use server";

import { auth } from "@/auth";
import { env } from "@/env";
import { createCourseSchema } from "@/schema";
import { z } from "zod";

interface CreateCourseData {
  data: z.infer<typeof createCourseSchema>;
}
export async function createCourse({
  data,
}: CreateCourseData): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user) {
      throw new Error("Unauthorized");
    }

    const isValid = createCourseSchema.safeParse(data);
    if (!isValid.success) {
      return { success: false, message: "Invalid course data." };
    }
    console.log(isValid.data);

    const response = await fetch(
      `${env.BACKEND_API_URL}/course/create-course`,
      {
        method: "POST",
        body: JSON.stringify({
          title: isValid.data.title,
          categoryId: isValid.data.categoryId,
          grade: isValid.data.grade,
        }),
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create course.");
    }
    return { success: true, message: "Course created successfully." };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create course.");
  }
}
