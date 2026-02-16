import type { loginSchema, registerSchema } from "@sporty/validation";
import type { z } from "zod";
import { axiosClient } from "@/lib/axios-client";

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

import { useMutation } from "@tanstack/react-query";

export const authKey = {
  all: ["auth"],
  login: () => [...authKey.all, "login"],
  register: () => [...authKey.all, "register"],
};

const authApi = {
  login: (data: LoginRequest) => {
    return axiosClient.post<AuthResponse>("/auth/login", data);
  },

  register: (data: RegisterRequest) => {
    return axiosClient.post<AuthResponse>("/auth/register", data);
  },
};

export const useLogin = () => {
  return useMutation({
    mutationKey: authKey.login(),
    mutationFn: authApi.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: authKey.register(),
    mutationFn: authApi.register,
  });
};
