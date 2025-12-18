import { envs } from '@/config/envs';
import axios from 'axios';
import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}

type ApiResponse<T> = {
  data?: {
    data: T;
  };
  user?: T;
  paginacion?: T;
  message: string;
};

type ApiResult<T> = {
  data: T | undefined;
  paginacion?: unknown;
  status: number;
  message: string;
};

class ApiClient {
  private axiosInstance;
  private failedQueue: FailedRequest[] = [];
  private isRefreshing = false;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: envs.api,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private getTokenFromCookies(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  private processQueue(error: unknown, token: string | null = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    this.failedQueue = [];
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getTokenFromCookies();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;
        const isAuthRoute = originalRequest?.url?.includes('/auth/login');

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAuthRoute
        ) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            })
              .then(() => this.axiosInstance(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            await axios.post(
              `${envs.api}/auth/refresh`,
              {},
              { withCredentials: true },
            );

            this.processQueue(null, this.getTokenFromCookies());
            this.isRefreshing = false;

            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.isRefreshing = false;

            // Disparar evento global para que el hook lo capture
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('sessionExpired'));
            }

            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private normalizeResponse<T>(res: AxiosResponse<ApiResponse<T>>): ApiResult<T> {
    return {
      data: res.data.data?.data,
      paginacion: res.data.paginacion,
      status: res.status,
      message: res.data.message,
    };
  }

  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResult<T>> {
    const res = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return this.normalizeResponse(res);
  }

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResult<T>> {
    const res = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
    return this.normalizeResponse(res);
  }

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResult<T>> {
    const res = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return this.normalizeResponse(res);
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResult<T>> {
    const res = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return this.normalizeResponse(res);
  }

  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResult<T>> {
    const res = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return this.normalizeResponse(res);
  }
}

// Exportar una instancia única del cliente
const apiClient = new ApiClient();

export default apiClient;
