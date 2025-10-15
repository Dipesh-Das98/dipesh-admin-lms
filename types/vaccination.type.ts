export type CreateVaccinationData = {
  vaccineName: string;
  weekNumber: number;
  description: string;
  isActive: boolean;
};

export type VaccinationResponseData = {
  id: string;
  vaccineName: string;
  weekNumber: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateVaccinationResponse = {
  success: boolean;
  message: string;
  data?: VaccinationResponseData; 
};
// New type for the GET response
export type GetVaccinationResponse = {
  success: boolean;
  message: string;
  data?: VaccinationResponseData; // The fetched data, optional in case of failure
};

export type UpdateVaccinationData = {
  vaccineName?: string;
  weekNumber?: number;
  description?: string;
  isActive?: boolean;
};

// New type for the PATCH response
export type UpdateVaccinationResponse = {
  success: boolean;
  message: string;
  data?: VaccinationResponseData; // The updated data, optional in case of failure
};

// Defining the type for the DELETE response
export type DeleteVaccinationResponse = {
  success: boolean;
  message: string;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: 'ASC' | 'DESC'; // Assuming sort order options
  isActive?: boolean;
};

export type MetaData = {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
};

export type GetAllVaccinationsResponse = {
  success: boolean;
  message: string;
  data: {
    vaccinations: VaccinationResponseData[]; // The array of results
    meta: MetaData;
  };
};