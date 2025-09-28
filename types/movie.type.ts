import { Language } from "@/config/forms/child-form-options";

export interface Movie {
  id: string;
  title: string;
  categoryId: string;
  grade: string;
  language: Language;
  description: string;
  thumbnail: string;
  mediaUrl: string;
  backgroundColor: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateMovieData = Omit<Movie, "id" | "createdAt" | "updatedAt">;
export type UpdateMovieData = Partial<CreateMovieData> & { id: string };

export type MovieApiResponse = {
  success: boolean;
  data: {
    movie: Movie[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type MovieFilters = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
  grade?: string;
  language?: Language;
};

// Movie category interface for dropdown
export interface MovieCategory {
  id: string;
  name: string;
  description?: string;
}
