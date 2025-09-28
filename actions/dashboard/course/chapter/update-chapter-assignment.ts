"use server";

import { auth } from "@/auth";
import { env } from "@/env";
import { AssignmentQuiz } from "@/types";

export interface UpdateChapterAssignmentData {
  title: string;
  description?: string;
  isPublished: boolean;
  type: "QUIZ";
  questions: AssignmentQuiz[];
}

export interface UpdateChapterAssignmentResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    type: string;
    isPublished: boolean;
  };
}

export const updateChapterAssignment = async (
  chapterId: string,
  data: UpdateChapterAssignmentData
): Promise<UpdateChapterAssignmentResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate required fields
    if (!chapterId) {
      throw new Error("Chapter ID is required");
    }

    if (!data.title || data.title.trim().length < 1) {
      throw new Error("Assignment title is required");
    }

    if (!data.questions || data.questions.length === 0) {
      throw new Error("At least one quiz question is required");
    }

    // Validate quiz questions
    for (const question of data.questions) {
      if (!question.question || question.question.trim().length < 1) {
        throw new Error("Question text is required");
      }
      if (!question.options || question.options.length < 2) {
        throw new Error("At least 2 options are required for each question");
      }
      if (!question.answer || question.answer.trim().length < 1) {
        throw new Error("Correct answer is required for each question");
      }
      if (!question.options.includes(question.answer)) {
        throw new Error("The correct answer must be one of the provided options");
      }
    }

    console.log("Updating chapter assignment with data:", { chapterId, data });

    // Prepare the payload - convert questions to JSON string for the quiz field
    const payload = {
      title: data.title,
      description: data.description,
      isPublished: data.isPublished,
      type: data.type,
      questions: data.questions, // JSON stringify questions for the API
    };

    console.log("API payload:", payload);

    const response = await fetch(
      `${env.BACKEND_API_URL}/course/update-chapter-assignment/${chapterId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );



    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update chapter assignment");
    }

    console.log("Chapter assignment updated successfully:", result.data);
    return {
      success: true,
      message: result.message || "Chapter assignment updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating chapter assignment:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update chapter assignment",
    };
  }
};
