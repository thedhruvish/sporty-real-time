import type { createTeamSchema, updateTeamSchema } from "@sporty/validation";
import type { z } from "zod";
import { axiosClient } from "@/lib/axios-client";

export type CreateTeamRequest = z.infer<typeof createTeamSchema>;
export type UpdateTeamRequest = z.infer<typeof updateTeamSchema>;

export interface Team {
  id: string;
  name: string;
  logo: string;
  sportId: string;
  createdAt: string;
  updatedAt: string;
}

import { useMutation, useQuery } from "@tanstack/react-query";

export const teamsKey = {
  all: ["teams"],
  list: () => [...teamsKey.all, "list"],
  detail: (id: string) => [...teamsKey.all, "detail", id],
};

const teamsApi = {
  list: () => {
    return axiosClient.get<Team[]>("/teams");
  },

  getById: (id: string) => {
    return axiosClient.get<Team>(`/teams/${id}`);
  },

  create: (data: CreateTeamRequest) => {
    return axiosClient.post<Team>("/teams", data);
  },

  update: (id: string, data: UpdateTeamRequest) => {
    return axiosClient.patch<Team>(`/teams/${id}`, data);
  },

  delete: (id: string) => {
    return axiosClient.delete<Team>(`/teams/${id}`);
  },
};

export const useGetAllTeams = () => {
  return useQuery({
    queryKey: teamsKey.list(),
    queryFn: teamsApi.list,
  });
};

export const useGetTeamById = (id: string) => {
  return useQuery({
    queryKey: teamsKey.detail(id),
    queryFn: () => teamsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  return useMutation({
    mutationFn: teamsApi.create,
  });
};

export const useUpdateTeam = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamRequest }) =>
      teamsApi.update(id, data),
  });
};

export const useDeleteTeam = () => {
  return useMutation({
    mutationFn: teamsApi.delete,
  });
};
