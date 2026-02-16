import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios-client";
import type { LiveEvent, Match } from "@/types/sports";

export interface DashboardResponse {
  matches: Match[];
  liveEvents: LiveEvent[];
}

export const dashboardKey = {
  all: ["dashboard"],
  home: () => [...dashboardKey.all, "home"],
};

export const dashboardApi = {
  getHome: () => {
    return axiosClient.get<DashboardResponse>("/dashboard/home");
  },
};

export const useGetHomeDashboard = () => {
  return useQuery({
    queryKey: dashboardKey.home(),
    queryFn: dashboardApi.getHome,
    // staleTime: 1000 * 60, // 1 minute
    // refetchInterval: 1000 * 30, // 30 seconds
  });
};
