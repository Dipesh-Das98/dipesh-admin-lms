import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getSubscriptions } from "@/actions/dashboard/subscription/get-subscriptions";
import { SubscriptionResponse } from "@/types/subscription.type";

export const useSubscriptions = (
  options?: Omit<UseQueryOptions<SubscriptionResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => getSubscriptions(),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

export default useSubscriptions;
