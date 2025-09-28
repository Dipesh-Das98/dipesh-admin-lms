import { useQuery } from "@tanstack/react-query";
import { getCategoryByType } from "@/actions/dashboard/category/get-category";

export const useLanguageCorner = <T = unknown>(type: string) => {
  return useQuery<T>({
    queryKey: ["categories", type],
    queryFn: () => getCategoryByType(type),
  });
};
