import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ApiClientError {
  message: string;
  status?: number;
  errors?: unknown;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const res = response.data;

    if (!res.success) {
      return Promise.reject({
        message: res.message,
        status: response.status,
        errors: res.errors,
      } satisfies ApiClientError);
    }

    return {
      ...response,
      data: res.data,
    };
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message || "Server error",
        status: error.response.status,
        errors: error.response.data?.errors,
      } satisfies ApiClientError);
    }

    return Promise.reject({
      message: "Network error",
    } satisfies ApiClientError);
  },
);

export const axiosClient = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance
      .get<ApiResponse<T>, AxiosResponse<T>>(url, config)
      .then((r) => r.data),

  post: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance
      .post<ApiResponse<T>, AxiosResponse<T>>(url, data, config)
      .then((r) => r.data),

  put: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance
      .put<ApiResponse<T>, AxiosResponse<T>>(url, data, config)
      .then((r) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance
      .delete<ApiResponse<T>, AxiosResponse<T>>(url, config)
      .then((r) => r.data),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance
      .patch<ApiResponse<T>, AxiosResponse<T>>(url, data, config)
      .then((r) => r.data),
};
