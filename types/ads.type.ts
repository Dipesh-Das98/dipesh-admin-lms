export interface Ads {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface AdsResponse<T> {
  success: boolean;
  data?:T
  message?: string;
}
