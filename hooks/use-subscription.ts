import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getSubscriptionById } from "@/actions/dashboard/subscription/get-subscription";
import { SingleSubscriptionResponse } from "@/types/subscription.type";

export const useSubscription = (
  id: string,
  options?: Omit<UseQueryOptions<SingleSubscriptionResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ["subscription", id],
    queryFn: () => getSubscriptionById(id),
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

export default useSubscription;
