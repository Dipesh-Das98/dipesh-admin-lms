import { Language } from "@/config/forms/child-form-options";

// Re-export Language for convenience
export { Language } from "@/config/forms/child-form-options";

export interface Library {
  id: string;
  title: string;
  categoryId: string;
  grade: string;
  language: Language;
  description: string;
  thumbnail?: string;
  mediaUrl?: string;
  backgroundColor: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  order?: number;
}

export type CreateLibraryData = Omit<Library, "id" | "createdAt" | "updatedAt">;
export type UpdateLibraryData = Partial<CreateLibraryData> & { id: string };

export type LibraryApiResponse = {
  success: boolean;
  data: {
    libraries: Library[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type LibraryFilters = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  grade?: string;
  language?: Language;
};

// Library category interface for dropdown
export interface LibraryCategory {
  id: string;
  name: string;
  description?: string;
}
