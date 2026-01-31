import { envs } from "@/config/env"
import type { ApiResponse } from "@/types/api"

const API_BASE_URL = envs.apiUrl

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables")
}

class ApiClient {
    private baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        const token = this.getToken()

        const config: RequestInit = {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            credentials: "include",
        }

        const fullUrl = `${this.baseURL}${endpoint}`

        console.log("API Request:", fullUrl, config) // Solo se muestra en dev

        const response = await fetch(fullUrl, config)

        console.log("API Response:", response) // Solo se muestra en dev

        const data = await response.json()

        return data
    }


    private getToken(): string | null {
        if (typeof window === "undefined") return null
        return localStorage.getItem("access_token")
    }

    async get<T>(endpoint: string, options?: RequestInit) {
        return this.request<T>(endpoint, { ...options, method: "GET" })
    }

    async post<T>(endpoint: string, data?: unknown, options?: RequestInit) {
        return this.request<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async patch<T>(endpoint: string, data?: unknown, options?: RequestInit) {
        return this.request<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: JSON.stringify(data),
        })
    }

    async delete<T>(endpoint: string, options?: RequestInit) {
        return this.request<T>(endpoint, { ...options, method: "DELETE" })
    }
}

export const apiClient = new ApiClient(API_BASE_URL)
