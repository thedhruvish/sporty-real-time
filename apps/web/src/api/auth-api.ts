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
  tokenCreateForWebToken: ["tokenCreateForWebToken"],
  me: ["me"],
  webSocketToken: ["token"],
};

const authApi = {
  login: (data: LoginRequest) => {
    return axiosClient.post<AuthResponse>("/auth/login", data);
  },

  register: (data: RegisterRequest) => {
    return axiosClient.post<AuthResponse>("/auth/register", data);
  },

  tokenCreateForWebToken: () => {
    return axiosClient.get<AuthResponse>("/auth/token");
  },
  me: () => {
    return axiosClient.get<AuthResponse>("/auth/me");
  },
  webSocketToken: () => {
    return axiosClient.get<AuthResponse>("/auth/token");
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

export const useTokenCreateForWebToken = () => {
  return useMutation({
    mutationKey: authKey.tokenCreateForWebToken,
    mutationFn: authApi.tokenCreateForWebToken,
  });
};

export const useMe = () => {
  return useMutation({
    mutationKey: authKey.me,
    mutationFn: authApi.me,
  });
};

export const useWebSocketToken = () => {
  return useMutation({
    mutationKey: authKey.webSocketToken,
    mutationFn: authApi.webSocketToken,
  });
};
