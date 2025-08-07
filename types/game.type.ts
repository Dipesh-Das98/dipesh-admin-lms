import { Language } from "@/config/forms/child-form-options";

export interface Game {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  category?:GameCategory
  categoryId?: string;
  thumbnail?: string;
  gameConfig?: JSON; // Using any for JSON type
  timePerLevel?: number;
  backgroundColor?: string;
  language: Language;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateGameData = Omit<Game, "id" | "createdAt" | "updatedAt">;
export type UpdateGameData = Partial<CreateGameData> & { id: string };

export type GameApiResponse = {
  success: boolean;
  data: {
    games: Game[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type GameFilters = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
  language?: Language;
};

// Game category interface for dropdown
export interface GameCategory {
  id: string;
  name: string;
  description?: string;
}

// TOOD: Define the GameProgress interface based on your requirements
 
