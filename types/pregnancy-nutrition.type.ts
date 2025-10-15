
export type NutritionFact = {
  nutrient: string;
  value: string;
  dvPercentage?: number; // Optional based on the Zod schema in the previous attempt
};

// Data sent in the POST request body
export type CreatePregnancyNutritionData = {
  weekStart: number;
  weekEnd: number;
  foodCategory: string;
  foodName: string;
  foodImage: string; // Can be a URL or empty string
  healthBenefits: string[];
  nutritionFacts: NutritionFact[];
  isRecommended: boolean;
};

// Data returned in the success response
export type PregnancyNutritionTip = {
  id: string;
  weekStart: number;
  weekEnd: number;
  foodCategory: string;
  foodName: string;
  foodImage: string | null;
  healthBenefits: string[];
  nutritionFacts: NutritionFact[];
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
};

// Structure of the final action response
export interface CreatePregnancyNutritionResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    data: PregnancyNutritionTip; // Nested object
  };
}
export interface GetPregnancyNutritionResponse {
  success: boolean;
  message: string;
  data?: PregnancyNutritionTip; // Single object, NOT nested under a 'data' key here
}

export type UpdatePregnancyNutritionData = {
  weekStart: number;
  weekEnd: number;
  foodCategory: string;
  foodName: string;
  foodImage: string; 
  healthBenefits: string[];
  nutritionFacts: NutritionFact[]; // Reuse NutritionFact type
  isRecommended: boolean;
};

// Structure of the final action response
export interface UpdatePregnancyNutritionResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    data: PregnancyNutritionTip; // Nested updated object
  };
}

// --- Assumed types/pregnancy-nutrition.type.ts additions ---

// Structure of the final action response for deletion
export interface DeletePregnancyNutritionResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
  };
}

export type GetAllPregnancyNutritionTipsParams = {
  page: number;
  limit: number;
  // Based on your previous examples, we assume support for optional filtering/searching:
  search?: string; 
  sortOrder: "asc" | "desc"; 
  isRecommended?: boolean; // Corresponds to the 'isRecommended' field
};

// Metadata block for pagination
export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
};

// Data structure returned within the 'data' field of the API response
export type GetAllPregnancyNutritionData = {
  nutrition: PregnancyNutritionTip[]; // The list of items is under the 'nutrition' key
  meta: PaginationMeta;
};

// Structure of the final action response
export interface GetAllPregnancyNutritionTipsResponse {
  success: boolean;
  message: string;
  data?: GetAllPregnancyNutritionData;
}