import { Language } from "@/config/forms/child-form-options";

export interface Music {
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

export type CreateMusicData = Omit<Music, "id" | "createdAt" | "updatedAt">;
export type UpdateMusicData = Partial<CreateMusicData> & { id: string };

export type MusicApiResponse = {
  success: boolean;
  data: {
    music: Music[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type MusicFilters = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
  grade?: string;
  language?: Language;
};

// Music category interface for dropdown
export interface MusicCategory {
  id: string;
  name: string;
  description?: string;
}
