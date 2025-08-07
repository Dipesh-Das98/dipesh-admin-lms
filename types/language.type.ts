import { Category } from "@/types";import { Language } from "@/config/forms/child-form-options";

export interface LanguageCorner {
  id: string;
  title: string;
  categoryId: string;
  grade: string;
  description: string;
  thumbnail: string;
  mediaUrl: string;
  backgroundColor: string;
  category: Category;

  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateLanguageCornerData = Omit<LanguageCorner, "id" | "createdAt" | "updatedAt">;
export type UpdateLanguageCornerData = Partial<CreateLanguageCornerData> & { id: string };

export type LanguageCornerApiResponse = {
  success: boolean;
  data: {
    languageCorner: LanguageCorner[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type LanguageCornerFilters = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
  grade?: string;
  language?: Language;
};

// Language corner category interface for dropdown
export interface LanguageCornerCategory {
  id: string;
  name: string;
  description?: string;
}
