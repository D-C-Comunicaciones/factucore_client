"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { queryClient } from "@/lib/queryClient";
import { showToast } from "@/components/sonner/CustomToaster"
import { getSession } from "@/common/interfaces/session"
import { prefetchAllCatalogs } from "@/hooks/useCatalogs";

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
            // 🔥 Obtener CSRF Cookie primero
            await apiClient.csrfCookie()

            const res = await apiClient.post<any>(
                "/auth/login",
                { email, password },
                { withCredentials: true }
            )

            if (res.status === "error") {
                showToast(res.message || "Credenciales inválidas", "error")
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

            // 🔥 Prefetch and cache all catalogs for the session
            prefetchAllCatalogs(queryClient);

            showToast("Inicio de sesión exitoso", "success")
            router.push("/dashboard")

        } catch (error: any) {
            showToast(error?.response?.data?.message || "Credenciales inválidas", "error")
        }
    }

    // ✅ LOGOUT
    const logout = async () => {
        try {
            await apiClient.post("/logout", {}, { withCredentials: true })
        } catch { }
        // Clear client-side session storage
        try {
            // Remove known session key
            localStorage.removeItem("session");

            // Clear all storage (user requested full wipe)
            try { window.localStorage.clear(); } catch { }
            try { window.sessionStorage.clear(); } catch { }

            // Clear react-query caches
            try {
                // cancel pending queries
                queryClient.cancelQueries();
                // remove all queries and mutations
                queryClient.getQueryCache().clear();
                queryClient.getMutationCache().clear();
            } catch { }

            // Clear any caches (Service Worker Cache API)
            try {
                if (typeof window !== "undefined" && 'caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                }
            } catch { }

            // Clear cookies that are accessible from JS
            try {
                if (typeof document !== "undefined" && document.cookie) {
                    document.cookie.split(';').forEach((cookie) => {
                        const name = cookie.split('=')[0].trim();
                        // expire cookie
                        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
                        // try common domain variations
                        try { document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`; } catch { }
                        try { document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`; } catch { }
                    });
                }
            } catch { }

            // Attempt to delete IndexedDB databases (best-effort)
            try {
                // indexedDB.databases() is not supported everywhere
                const idb = (window as any).indexedDB;
                if (idb) {
                    if (typeof idb.databases === 'function') {
                        const dbs = await idb.databases();
                        await Promise.all(dbs.map((d: any) => idb.deleteDatabase(d.name)));
                    } else {
                        // Fallback: try common DB names used by libraries
                        const common = ['firebaseLocalStorageDb', 'workbox-cache', 'workbox-precache'];
                        await Promise.all(common.map(name => idb.deleteDatabase(name).catch(() => { })));
                    }
                }
            } catch { }

            // Unregister service workers (best-effort)
            try {
                if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
                    const regs = await navigator.serviceWorker.getRegistrations();
                    await Promise.all(regs.map(r => r.unregister()));
                }
            } catch { }

        } catch (e) {
            // swallow any errors during cleanup
        }

        // Reset local user state and navigate to login (force reload to clear memory)
        setUser(null)
        showToast("Sesión cerrada", "success")
        try {
            if (typeof window !== 'undefined') {
                // Use location.replace to ensure a full reload to the login page
                window.location.replace('/login');
                return;
            }
        } catch { }
        // Fallback to router navigation
        router.push('/login');
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