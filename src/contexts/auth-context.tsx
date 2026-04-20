"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

// Interfaces para tipar las respuestas del backend
interface BackendUser {
    id: number;
    name: string;
    email: string;
    level: string;
    roles: { id: number; name: string }[];
    permissions: { id: number; name: string }[];
}

interface LoginSuccessResponse {
    message: string;
    code: number;
    status: "success";
    data: {
        expires_in: number;
        account_type: string;
        user: BackendUser;
    };
}

interface LoginErrorResponse {
    message: string;
    code: number;
    status: "error";
    errors?: Record<string, string[]>;
    details?: any;
    trace?: any;
}

interface LogoutResponse {
    message: string;
    code: number;
    status: string;
}

interface AuthContextType {
    user: any
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // ✅ VALIDAR SESIÓN CON COOKIE
    useEffect(() => {
        apiClient.get<{ user: BackendUser }>("/me", { withCredentials: true })
            .then(res => {
                setUser(res.data.user)
            })
            .catch(() => {
                setUser(null)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    // ✅ LOGIN SOLO CON COOKIE
    const login = async (email: string, password: string) => {
        try {
            // Login
            const loginRes = await apiClient.post<LoginSuccessResponse | LoginErrorResponse>(
                "/auth/login",
                { email, password },
                { withCredentials: true }
            );

            // Si el backend responde con error
            if ((loginRes as LoginErrorResponse).status === "error") {
                const err = loginRes as LoginErrorResponse;
                toast.error(err.message || "Credenciales inválidas");
                return;
            }

            // Si es exitoso, obtener usuario
            const res = await apiClient.get<{ user: BackendUser }>("/me", {
                withCredentials: true
            });
            setUser(res.data.user);
            toast.success("Inicio de sesión exitoso");
            router.push("/dashboard");
        } catch (error: any) {
            // Si el error viene del backend
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Credenciales inválidas");
            }
            // No lanzar error, solo mostrar toast
        }
    }

    // ✅ LOGOUT BACKEND
    const logout = async () => {
        try {
            await apiClient.post<LogoutResponse>("/logout", {}, { withCredentials: true })
        } catch (e) {
            // incluso si falla, limpiamos frontend
        }
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