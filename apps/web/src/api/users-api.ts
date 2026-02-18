import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios-client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const usersKey = {
  all: ["users"],
  list: () => [...usersKey.all, "list"],
  detail: (id: string) => [...usersKey.all, "detail", id],
};

const usersApi = {
  list: () => {
    return axiosClient.get<User[]>("/users");
  },

  getById: (id: string) => {
    return axiosClient.get<User>(`/users/${id}`);
  },
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: usersKey.list(),
    queryFn: usersApi.list,
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: usersKey.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
};
