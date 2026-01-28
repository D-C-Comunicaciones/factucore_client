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
            const response = await apiClient.post<{
                token: string
                user: unknown
            }>("/auth/login", { email, password })

            AuthService.setToken(response.data.token)
            AuthService.setUser(response.data.user)
            setUser(response.data.user)

            toast.success("Inicio de sesión exitoso")
            router.push("/dashboard")
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al iniciar sesión"
            toast.error(message)
            throw error
        }
    }

    const logout = () => {
        // Clear all auth data
        AuthService.removeToken()
        setUser(null)

        // Clear any other app state if needed
        // Reset any global state here

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
