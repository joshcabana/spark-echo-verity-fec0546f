import { useQuery } from "@tanstack/react-query";

import { fetchPublicDrops } from "@/lib/dropSchedule";

export const usePublicDrops = () =>
  useQuery({
    queryKey: ["public-drops"],
    queryFn: fetchPublicDrops,
    staleTime: 60_000,
    retry: 1,
  });
