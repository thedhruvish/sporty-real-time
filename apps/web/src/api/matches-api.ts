import type { createMatchSchema, updateMatchSchema } from "@sporty/validation";
import type { z } from "zod";
import { axiosClient } from "@/lib/axios-client";

export type CreateMatchRequest = z.infer<typeof createMatchSchema>;
export type UpdateMatchRequest = z.infer<typeof updateMatchSchema>;

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  leagueId: string;
  startTime: string;
  status: string;
  score: string;
  createdAt: string;
  updatedAt: string;
}

import { useMutation, useQuery } from "@tanstack/react-query";

export const matchesKey = {
  all: ["matches"],
  list: () => [...matchesKey.all, "list"],
  detail: (id: string) => [...matchesKey.all, "detail", id],
};

const matchesApi = {
  list: () => {
    return axiosClient.get<Match[]>("/matches");
  },

  getById: (id: string) => {
    return axiosClient.get<Match>(`/matches/${id}`);
  },

  create: (data: CreateMatchRequest) => {
    return axiosClient.post<Match>("/matches", data);
  },

  update: (id: string, data: UpdateMatchRequest) => {
    return axiosClient.patch<Match>(`/matches/${id}`, data);
  },

  delete: (id: string) => {
    return axiosClient.delete<Match>(`/matches/${id}`);
  },
};

export const useGetAllMatches = () => {
  return useQuery({
    queryKey: matchesKey.list(),
    queryFn: matchesApi.list,
  });
};

export const useGetMatchById = (id: string) => {
  return useQuery({
    queryKey: matchesKey.detail(id),
    queryFn: () => matchesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateMatch = () => {
  return useMutation({
    mutationFn: matchesApi.create,
  });
};

export const useUpdateMatch = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMatchRequest }) =>
      matchesApi.update(id, data),
  });
};

export const useDeleteMatch = () => {
  return useMutation({
    mutationFn: matchesApi.delete,
  });
};
