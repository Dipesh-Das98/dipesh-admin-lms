// src/types/pregnancy.type.ts (or wherever your types are located)

export type CreatePregnancyWeekData = {
  week: number;
  trimester: number;
  fetalSizeCm: number;
  sizeComparison: string;
  comparisonImage: string;
  developmentMilestones: string[];
  maternalChanges: string[];
  hasHeartbeat: boolean;
  heartbeatAudio: string;
};

// The type for the successful data returned from the API
export type PregnancyWeekContent = CreatePregnancyWeekData & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

// Standardized response type for the function
export type CreatePregnancyWeekResponse = {
  success: boolean;
  message: string;
  data?: PregnancyWeekContent;
};

export type UpdatePregnancyWeekData = Partial<CreatePregnancyWeekData>;

// Standardized response type for the update function (same structure as create)
export type UpdatePregnancyWeekResponse = {
  success: boolean;
  message: string;
  data?: PregnancyWeekContent; // Use the same return type
};

// src/types/pregnancy.type.ts (Reusing existing types)

// Standardized response type for the fetch function
export type GetPregnancyWeekResponse = {
  success: boolean;
  message: string;
  data?: PregnancyWeekContent; // Use the same return type
};

// src/types/pregnancy.type.ts (Adding a new type for the Delete response)

// Standardized response type for the delete function
export type DeletePregnancyWeekResponse = {
  success: boolean;
  message: string;
  // No data property is expected, as the resource is removed
};

// src/types/pregnancy.type.ts (Updated/Refined Types)

export type GetPregnancyWeekContentMeta = {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
};

export type GetAllPregnancyWeekContentParams = {
  page?: number;
  limit?: number;
  search?: string;       // optional search query
  sortOrder?: "asc" | "desc"; // optional sort order
  // Let's stick to only the parameters shown in the curl for strictness
};

export type GetAllPregnancyWeekContentResponseData = {
  pregnancyWeekContents: PregnancyWeekContent[]; // Array of content items
  meta: GetPregnancyWeekContentMeta; // Separate metadata structure
};

// Standardized response type for the function
export type GetAllPregnancyWeekContentResponse = {
  success: boolean;
  message: string;
  data: GetAllPregnancyWeekContentResponseData;
};