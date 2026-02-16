import type {
  createLiveEventSchema,
  updateLiveEventSchema,
} from "@sporty/validation";
import type { z } from "zod";
import { axiosClient } from "@/lib/axios-client";

export type CreateLiveEventRequest = z.infer<typeof createLiveEventSchema>;
export type UpdateLiveEventRequest = z.infer<typeof updateLiveEventSchema>;

export interface LiveEvent {
  id: string;
  name: string;
  matchId: string;
  status: string;
  score: string;
  minute: number;
  createdAt: string;
  updatedAt: string;
}

import { useMutation, useQuery } from "@tanstack/react-query";

export const liveEventsKey = {
  all: ["live-events"],
  list: () => [...liveEventsKey.all, "list"],
  detail: (id: string) => [...liveEventsKey.all, "detail", id],
};

const liveEventsApi = {
  list: () => {
    return axiosClient.get<LiveEvent[]>("/live-events");
  },

  getById: (id: string) => {
    return axiosClient.get<LiveEvent>(`/live-events/${id}`);
  },

  create: (data: CreateLiveEventRequest) => {
    return axiosClient.post<LiveEvent>("/live-events", data);
  },

  update: (id: string, data: UpdateLiveEventRequest) => {
    return axiosClient.patch<LiveEvent>(`/live-events/${id}`, data);
  },

  delete: (id: string) => {
    return axiosClient.delete<LiveEvent>(`/live-events/${id}`);
  },
};

export const useGetAllLiveEvents = () => {
  return useQuery({
    queryKey: liveEventsKey.list(),
    queryFn: liveEventsApi.list,
  });
};

export const useGetLiveEventById = (id: string) => {
  return useQuery({
    queryKey: liveEventsKey.detail(id),
    queryFn: () => liveEventsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateLiveEvent = () => {
  return useMutation({
    mutationFn: liveEventsApi.create,
  });
};

export const useUpdateLiveEvent = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLiveEventRequest }) =>
      liveEventsApi.update(id, data),
  });
};

export const useDeleteLiveEvent = () => {
  return useMutation({
    mutationFn: liveEventsApi.delete,
  });
};
