import { Language } from "@/config/forms/child-form-options";

export interface Story {
  id: string;
  title: string;
  categoryId: string;
  grade: string;
  language: Language;
  description: string;
  thumbnail: string;
  mediaUrl: string;
  backgroundColor: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  order?: number;
}

export type CreateStoryData = Omit<Story, "id" | "createdAt" | "updatedAt">;
export type UpdateStoryData = Partial<CreateStoryData> & { id: string };

export type StoryApiResponse = {
  success: boolean;
  data: {
    stories: Story[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type StoryFilters = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
  grade?: string;
  language?: Language;
};

// Story category interface for dropdown
export interface StoryCategory {
  id: string;
  name: string;
  description?: string;
}
