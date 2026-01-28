import type { ApiResponse } from "@/types/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

console.log('API_BASE_URL:', API_BASE_URL) // 👈 Agrega esto temporalmente

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables")
}

class ApiClient {
    private baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
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

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config)

            // Check if response is ok before trying to parse JSON
            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`

                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch {
                    // If JSON parsing fails, use the status text
                }

                throw new Error(errorMessage)
            }

            const data = await response.json()

            // Check if the API response indicates an error
            if (data.status === "error") {
                throw new Error(data.message || "Error en la petición")
            }

            return data
        } catch (error) {
            // Handle network errors
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error(
                    `No se pudo conectar con el servidor en ${this.baseURL}. ` +
                    `Verifica que la API esté corriendo y la URL sea correcta.`
                )
            }

            if (error instanceof Error) {
                throw error
            }

            throw new Error("Error desconocido en la petición")
        }
    }

    private getToken(): string | null {
        if (typeof window === "undefined") return null
        return localStorage.getItem("auth_token")
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
