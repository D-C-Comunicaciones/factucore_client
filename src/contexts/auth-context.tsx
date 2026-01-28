"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

interface AuthContextType {
    user: unknown
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<unknown>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = AuthService.getToken()
        const savedUser = AuthService.getUser()

        if (token && savedUser) {
            setUser(savedUser)
        }

        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        try {
            // Llama a la API y espera la estructura correcta de respuesta
            const response = await apiClient.post<any>("/auth/login", { email, password })

            // SOPORTA RESPUESTA: { data: { access_token, user, roles, permissions } }
            const data = response.data?.data || response.data

            const access_token = data.access_token
            const user = data.user
            const roles = data.roles
            const permissions = data.permissions

            if (!access_token || !user) {
                throw new Error("Credenciales inválidas o respuesta inesperada del backend")
            }

            // Guarda el token y el usuario correctamente
            AuthService.setToken(access_token)
            AuthService.setUser({ ...user, roles, permissions })
            setUser({ ...user, roles, permissions })

            toast.success("Inicio de sesión exitoso")
            router.push("/dashboard")
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al iniciar sesión"
            toast.error(message)
            throw error
        }
    }

    const logout = () => {
        AuthService.removeToken()
        setUser(null)
        toast.success("Sesión cerrada exitosamente")
        router.push("/login")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
