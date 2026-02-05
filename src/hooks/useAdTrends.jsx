import { useQuery } from "@tanstack/react-query";
import { fetchAdTrends } from "@/services/api/ad";

export function useAdTrends({ productId, date }) {
  return useQuery({
    queryKey: ["adTrends", productId, date],
    queryFn: () => fetchAdTrends({ productId, date }),
    enabled: Number.isFinite(productId) && productId > 0,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}