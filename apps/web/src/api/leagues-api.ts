import type {
  createLeagueSchema,
  updateLeagueSchema,
} from "@sporty/validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { axiosClient } from "@/lib/axios-client";

export type CreateLeagueRequest = z.infer<typeof createLeagueSchema>;
export type UpdateLeagueRequest = z.infer<typeof updateLeagueSchema>;

export interface League {
  id: string;
  name: string;
  sportId: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export const leaguesKey = {
  all: "leagues",
  list: () => [leaguesKey.all, "list"],
  detail: (id: string) => [leaguesKey.all, "detail", id],
};

const leaguesApi = {
  list: () => {
    return axiosClient.get<League[]>("/leagues");
  },

  getById: (id: string) => {
    return axiosClient.get<League>(`/leagues/${id}`);
  },

  create: (data: CreateLeagueRequest) => {
    return axiosClient.post<League>("/leagues", data);
  },

  update: (id: string, data: UpdateLeagueRequest) => {
    return axiosClient.patch<League>(`/leagues/${id}`, data);
  },

  delete: (id: string) => {
    return axiosClient.delete<League>(`/leagues/${id}`);
  },
};

export const useGetAllLeagues = () => {
  return useQuery({
    queryKey: leaguesKey.list(),
    queryFn: leaguesApi.list,
  });
};

export const useGetLeagueById = (id: string) => {
  return useQuery({
    queryKey: leaguesKey.detail(id),
    queryFn: () => leaguesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateLeague = () => {
  return useMutation({
    mutationFn: leaguesApi.create,
  });
};

export const useUpdateLeague = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeagueRequest }) =>
      leaguesApi.update(id, data),
  });
};

export const useDeleteLeague = () => {
  return useMutation({
    mutationFn: leaguesApi.delete,
  });
};
