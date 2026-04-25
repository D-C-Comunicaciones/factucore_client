"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { getSession } from "@/common/interfaces/session"

interface BackendUser {
    id: number
    name: string
    email: string
    level: string
    roles: { id: number; name: string }[]
    permissions: { id: number; name: string }[]
}

interface AuthContextType {
    user: BackendUser | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<BackendUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // ✅ INIT desde localStorage (SIN API)
    useEffect(() => {
        const session = getSession()

        if (session?.user) {
            setUser({
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                level: session.role?.name || "",
                roles: session.role
                    ? [{ id: session.role.id || 0, name: session.role.name || "" }]
                    : [],
                permissions: Array.isArray(session.permissions)
                    ? session.permissions.map((p: string, i: number) => ({
                        id: i,
                        name: p
                    }))
                    : []
            })
        } else {
            setUser(null)
        }

        setIsLoading(false)
    }, [])

    // ✅ LOGIN SIN /me
    const login = async (email: string, password: string) => {
        try {
            const res = await apiClient.post<any>(
                "/auth/login",
                { email, password },
                { withCredentials: true }
            )

            if (res.status === "error") {
                toast.error(res.message || "Credenciales inválidas")
                return
            }

            const session = res.data

            // 🔥 Guardar sesión
            localStorage.setItem("session", JSON.stringify(session))

            // 🔥 Setear user seguro
            setUser({
                id: session.user?.id,
                name: session.user?.name,
                email: session.user?.email,
                level: session.role?.name || "",
                roles: session.role
                    ? [{ id: session.role.id || 0, name: session.role.name || "" }]
                    : [],
                permissions: Array.isArray(session.permissions)
                    ? session.permissions.map((p: string, i: number) => ({
                        id: i,
                        name: p
                    }))
                    : []
            })

            toast.success("Inicio de sesión exitoso")
            router.push("/dashboard")

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Credenciales inválidas")
        }
    }

    // ✅ LOGOUT
    const logout = async () => {
        try {
            await apiClient.post("/logout", {}, { withCredentials: true })
        } catch { }

        localStorage.removeItem("session")
        setUser(null)

        toast.success("Sesión cerrada")
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
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}