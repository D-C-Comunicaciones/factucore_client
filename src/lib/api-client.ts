import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import { envs } from "@/config/env"
import type { ApiResponse } from "@/types/api"

const API_BASE_URL = envs.apiUrl

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables")
}

class ApiClient {
    private client: AxiosInstance

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            withCredentials: true, // 🔥 CLAVE: enviar cookies automáticamente
            withXSRFToken: true,
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })

        // 🔥 INTERCEPTOR REQUEST (debug opcional y bearer token)
        this.client.interceptors.request.use(
            (config) => {
                // 1. Obtener el token de localStorage (evitando dependencias circulares)
                let token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
                
                if (!token && typeof window !== 'undefined') {
                    const sessionStr = localStorage.getItem('session');
                    if (sessionStr) {
                        try {
                            const session = JSON.parse(sessionStr);
                            // La API retorna token como objeto { access_token: "..." } o como string
                            token = typeof session?.token === 'string' 
                                ? session.token 
                                : (session?.token?.access_token || session?.access_token || null);
                        } catch (e) {}
                    }
                }
                
                // 2. Inyectar Bearer Token si existe
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                if (process.env.NODE_ENV === "development") {
                    // Ocultar el token en logs por seguridad
                    const safeConfig = { ...config };
                    if (safeConfig.headers && safeConfig.headers['Authorization']) {
                        const safeHeaders = { ...safeConfig.headers };
                        safeHeaders['Authorization'] = '[SECURE_TOKEN_HIDDEN]';
                        safeConfig.headers = safeHeaders as any;
                    }
                    console.log("API Request:", safeConfig.method?.toUpperCase(), safeConfig.url, safeConfig);
                }
                return config;
            },
            (error) => Promise.reject(error)
        )

        // 🔥 INTERCEPTOR RESPONSE
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                if (process.env.NODE_ENV === "development") {
                    console.log("API Response:", response)
                }
                return response
            },
            async (error) => {
                // 🔥 Manejo global de errores
                if (error.response) {
                    const status = error.response.status

                    // 🔥 Si no autorizado → limpiar sesión y redirigir
                    if (status === 401) {
                        if (typeof window !== "undefined") {
                            if (window.location.pathname !== "/login") {
                                localStorage.clear()
                                sessionStorage.clear()

                                const { queryClient } = require("./queryClient")
                                queryClient.clear()

                                window.location.href = "/login"
                            }
                        }
                    }
                }

                return Promise.reject(error)
            }
        )
    }

    // 🔥 CSRF Cookie
    async csrfCookie(): Promise<void> {
        const baseUrl = this.client.defaults.baseURL;
        await this.client.get(`${baseUrl}/sanctum/csrf-cookie`);
    }

    // 🔥 GET
    async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.get<ApiResponse<T>>(endpoint, config)
        return response.data
    }

    // 🔥 GET BLOB
    async getBlob(endpoint: string, config?: AxiosRequestConfig): Promise<Blob> {
        const response = await this.client.get(endpoint, {
            ...config,
            responseType: 'blob'
        })
        return response.data
    }

    // 🔥 POST
    async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(endpoint, data, config)
        return response.data
    }

    // 🔥 POST BLOB
    async postBlob(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<Blob> {
        const response = await this.client.post(endpoint, data, {
            ...config,
            responseType: 'blob'
        })
        return response.data
    }

    // 🔥 POST BLOB (con headers, para leer Content-Disposition)
    async postBlobFull(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<Blob>> {
        return this.client.post(endpoint, data, {
            ...config,
            responseType: 'blob'
        })
    }

    // 🔥 PATCH
    async patch<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.patch<ApiResponse<T>>(endpoint, data, config)
        return response.data
    }

    // 🔥 PUT
    async put<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.put<ApiResponse<T>>(endpoint, data, config)
        return response.data
    }

    // 🔥 DELETE
    async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.delete<ApiResponse<T>>(endpoint, config)
        return response.data
    }
}

export const apiClient = new ApiClient(API_BASE_URL)