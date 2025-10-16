// types/hospital.type.ts

// --- Slot and Vaccination Sub-Types ---
export type HospitalVaccinationSlot = {
  date: string; // e.g., "2024-10-12"
  start: string; // e.g., "08:00"
  end: string;   // e.g., "10:00"
  session: string; // e.g., "Morning"
};

export type HospitalVaccination = {
  name: string;
  age_range: string;
  description: string;
  slots: HospitalVaccinationSlot[];
};

// --- Input Data Type ---
export type CreateHospitalData = {
  name: string;
  address: string;
  phone: string;
  emergencyContact: string;
  rating: number;
  latitude: number;
  longitude: number;
  vaccinations: HospitalVaccination[];
  isActive: boolean;
};

// --- Response Data Type (The created hospital record) ---
export type HospitalRecord = CreateHospitalData & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

// --- Full Action Response Type ---
export type CreateHospitalResponse = {
  success: boolean;
  message: string;
  data?: HospitalRecord; // Optional data if success is true
};

export type UpdateHospitalData = Partial<Omit<HospitalRecord, 'id' | 'createdAt' | 'updatedAt'>>;

export type UpdateHospitalResponse = {
  success: boolean;
  message: string;
  data?: HospitalRecord; // Optional data if success is true
};

export type DeleteHospitalResponse = {
  success: boolean;
  message: string;
  data?: { message: string }; // The specific data structure for the delete success message
};

export type GetHospitalsByClinicResponse = {
  success: boolean;
  message: string;
  data?: {
    message: string;
    data: HospitalRecord[]; // Array of HospitalRecord
  };
};

// types/common.type.ts (General Types)

// --- Pagination Input Parameters ---
export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
  // Allows the caller to explicitly pass true, false, or undefined
  isActive?: boolean; 
};

// --- Pagination Metadata from API Response ---
export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
};

export type GetAllHospitalsData = {
  hospitals: HospitalRecord[];
  meta: PaginationMeta;
};

// --- Full Action Response Type ---
export type GetAllHospitalsResponse = {
  success: boolean;
  message: string;
  data: GetAllHospitalsData; // Data is expected to always be present, even if list is empty
};