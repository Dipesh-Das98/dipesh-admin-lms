import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getCategories } from "@/actions/dashboard/category/get-categories";
import { getCategoryByType } from "@/actions/dashboard/category/get-category";

export const useCategory = <T>(
  id: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryByType(id),
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 10, // 10 minutes (categories change less frequently)
    ...options,
  });
};

export const useCategories = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
  type?: string,
  isActive?: boolean
) => {
  return useQuery({
    queryKey: ["categories", page, limit, search, sortBy, sortOrder, type, isActive],
    queryFn: () => getCategories(page, limit, search, sortBy, sortOrder, type, isActive),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategoriesByType = <T = unknown>(type: string) => {
  return useQuery<T>({
    queryKey: ["categories", type],
    queryFn: () => getCategoryByType(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useCategory;
