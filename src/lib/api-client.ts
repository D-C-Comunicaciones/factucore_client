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

        // 🔥 INTERCEPTOR REQUEST (debug opcional)
        this.client.interceptors.request.use(
            (config) => {
                if (process.env.NODE_ENV === "development") {
                    console.log("API Request:", config.method?.toUpperCase(), config.url, config)
                }
                return config
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

                    // 🔥 Si no autorizado → limpiar sesión
                    if (status === 401) {
                        if (typeof window !== "undefined") {
                            localStorage.removeItem("auth_user")
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

    // 🔥 POST
    async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(endpoint, data, config)
        return response.data
    }

    // 🔥 PATCH
    async patch<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.patch<ApiResponse<T>>(endpoint, data, config)
        return response.data
    }

    // 🔥 DELETE
    async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.delete<ApiResponse<T>>(endpoint, config)
        return response.data
    }
}

export const apiClient = new ApiClient(API_BASE_URL)