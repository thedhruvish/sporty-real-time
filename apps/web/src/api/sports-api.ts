import type { createSportSchema, updateSportSchema } from "@sporty/validation";
import type { z } from "zod";
import { axiosClient } from "@/lib/axios-client";

export type CreateSportRequest = z.infer<typeof createSportSchema>;
export type UpdateSportRequest = z.infer<typeof updateSportSchema>;

export interface Sport {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

import { useMutation, useQuery } from "@tanstack/react-query";

export const sportsKey = {
  all: ["sports"],
  list: () => [...sportsKey.all, "list"],
  detail: (id: string) => [...sportsKey.all, "detail", id],
};

const sportsApi = {
  list: () => {
    return axiosClient.get<Sport[]>("/sports");
  },

  getById: (id: string) => {
    return axiosClient.get<Sport>(`/sports/${id}`);
  },

  create: (data: CreateSportRequest) => {
    return axiosClient.post<Sport>("/sports", data);
  },

  update: (id: string, data: UpdateSportRequest) => {
    return axiosClient.patch<Sport>(`/sports/${id}`, data);
  },

  delete: (id: string) => {
    return axiosClient.delete<Sport>(`/sports/${id}`);
  },
};

export const useGetAllSports = () => {
  return useQuery({
    queryKey: sportsKey.list(),
    queryFn: sportsApi.list,
  });
};

export const useGetSportById = (id: string) => {
  return useQuery({
    queryKey: sportsKey.detail(id),
    queryFn: () => sportsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSport = () => {
  return useMutation({
    mutationFn: sportsApi.create,
  });
};

export const useUpdateSport = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSportRequest }) =>
      sportsApi.update(id, data),
  });
};

export const useDeleteSport = () => {
  return useMutation({
    mutationFn: sportsApi.delete,
  });
};
