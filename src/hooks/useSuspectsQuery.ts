import { useQuery } from "@tanstack/react-query";
import { fetchSuspects } from "../dal/api";

// Suspects list never changes during server lifetime — cache indefinitely
export const useSuspectsQuery = () => {
  return useQuery({
    queryKey: ["suspects"],
    queryFn: ({ signal }) => fetchSuspects(signal),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
