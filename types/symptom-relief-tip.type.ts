// /types/symptom-relief-tip.type.ts


export interface CreateSymptomReliefTipData {
  symptomName: string;
  tip: string;
}

export interface SymptomReliefTip {
  id: string;
  symptomName: string;
  tip: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetSymptomReliefTipResponse {
  success: boolean;
  message: string;
  data?: SymptomReliefTip; // The entity is at the top level on success
}

// NOTE: We don't need to define CreateSymptomReliefTipData or CreateSymptomReliefTipResponse here, 
// as those were for the previous action.
/** The standard response structure used by your actions */
export interface CreateSymptomReliefTipResponse {
  success: boolean;
  message: string;
  data?: { 
    message: string; // Inner success message from API
    data: SymptomReliefTip; // The created entity
  }; 
}

export interface UpdateSymptomReliefTipData {
  id: string; // Required for the action function parameter
  symptomName?: string;
  tip?: string;
  isActive?: boolean;
}

/** Standard API response structure for an update operation */
export interface UpdateSymptomReliefTipResponse {
  success: boolean;
  message: string;
  // Note: Data is nested in the API response, matching your previous actions
  data?: {
    message: string;
    data: SymptomReliefTip; // The updated entity
  };
}

export interface DeleteSymptomReliefTipResponse {
  success: boolean;
  message: string;
  // Note: Data is nested in the API response, but contains only a message
  data?: {
    message: string;
  };
}

// /types/symptom-relief-tip.type.ts (Add these interfaces)

// Reusing SymptomReliefTip from previous actions

/** Parameters for fetching all tips with pagination and search */
export interface GetAllSymptomReliefTipsParams {
  page: number;
  limit: number;
  search?: string; // Assuming search capability might be added later
  sortOrder: "asc" | "desc"; 
  isActive?: boolean; // Assuming filtering by status might be needed
}

/** Pagination metadata structure */
export interface SymptomReliefTipMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

/** The main response structure for fetching a paginated list of tips */
export interface GetAllSymptomReliefTipsResponse {
  success: boolean;
  message: string;
  data?: {
    symptomReliefTips: SymptomReliefTip[]; // The array of entities
    meta: SymptomReliefTipMeta;
  };
}