"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { AuthService } from "@/lib/auth"
import { queryClient } from "@/lib/queryClient";
import { showToast } from "@/components/sonner/CustomToaster"
import { getSession } from "@/common/interfaces/session"
import { prefetchAllCatalogs } from "@/hooks/useCatalogs";
import { SplashScreen } from "@/components/SplashScreen";
import { AuthFlowService } from "@/lib/authFlow";
import { extractErrorMessage } from "@/lib/errors";
import type { TwoFactorChallengePayload } from "@/types/auth";

interface BackendUser {
    id: number
    name: string
    email: string
    level: string
    roles: { id: number; name: string }[]
    permissions: { id: number; name: string }[]
    account_type?: string
    tenant_id?: string
    channels?: string[]
    modules?: string[]
    scopes?: string[]
    features?: string[]
    features_override?: any[]
}

export interface LoginRequires2FAResult {
    requires2fa: true
    challengeToken: string
    expiresIn: number
}

interface AuthContextType {
    user: BackendUser | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<LoginRequires2FAResult | void>
    completeTwoFactorChallenge: (challengeToken: string, credentials: Omit<TwoFactorChallengePayload, "challenge_token">) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<BackendUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showSplash, setShowSplash] = useState(true) // covers initial load & page refresh
    const pendingLogoutRef = useRef(false)
    const router = useRouter()

    const handleSplashDone = () => {
        setShowSplash(false)
        if (pendingLogoutRef.current) {
            pendingLogoutRef.current = false
            router.push("/login")
        }
    }

    // ✅ INIT desde localStorage (SIN API)
    useEffect(() => {
        const session = getSession()

        if (session?.user) {
            const userRoles = session.user.roles || [];
            const userPermissions = session.user.permissions || [];
            
            setUser({
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                level: userRoles.length > 0 ? userRoles[0].name : "",
                roles: userRoles.map((r: any) => ({ id: r.id || 0, name: r.name || "" })),
                permissions: userPermissions.map((p: any, i: number) => ({
                    id: p.id !== undefined ? p.id : i,
                    name: typeof p === 'string' ? p : (p.name || "")
                })),
                account_type: session.account_type,
                tenant_id: session.tenant_id,
                channels: session.channels || [],
                modules: session.modules || [],
                scopes: session.scopes || [],
                features: session.features || [],
                features_override: session.features_override || []
            })
        } else {
            setUser(null)
        }

        setIsLoading(false)
    }, [])

    // ✅ Aplica una sesión exitosa (login normal o challenge 2FA resuelto)
    const applyLoginSession = (session: any, message?: string) => {
        // 🔥 Guardar sesión
        localStorage.setItem("session", JSON.stringify(session))

        // 🔥 Guardar company de forma independiente
        if (session.company) {
            AuthService.setCompany(session.company)
        }

        // 🔥 Setear user seguro
        const userRoles = session.user?.roles || [];
        const userPermissions = session.user?.permissions || [];

        setUser({
            id: session.user?.id,
            name: session.user?.name,
            email: session.user?.email,
            level: userRoles.length > 0 ? userRoles[0].name : "",
            roles: userRoles.map((r: any) => ({ id: r.id || 0, name: r.name || "" })),
            permissions: userPermissions.map((p: any, i: number) => ({
                id: p.id !== undefined ? p.id : i,
                name: typeof p === 'string' ? p : (p.name || "")
            })),
            account_type: session.account_type,
            tenant_id: session.tenant_id,
            channels: session.channels || [],
            modules: session.modules || [],
            scopes: session.scopes || [],
            features: session.features || [],
            features_override: session.features_override || []
        })

        // 🔥 Prefetch and cache all catalogs for the session
        prefetchAllCatalogs(queryClient);

        showToast(message || "Inicio de sesión exitoso", "success")
        setShowSplash(true) // Splash will fade out after its animation; navigate once it's done
    }

    // ✅ LOGIN SIN /me
    const login = async (email: string, password: string): Promise<LoginRequires2FAResult | void> => {
        try {
            // 🔥 Obtener CSRF Cookie primero
            await apiClient.csrfCookie()

            const res = await apiClient.post<any>(
                "/auth/login",
                { email, password },
                { withCredentials: true }
            )

            if (res.status === "error") {
                const errorMsg = res.message || "Credenciales inválidas"
                showToast(errorMsg, "error")
                throw new Error(errorMsg)
            }

            // 🔥 Cuenta con 2FA activo: requiere un segundo paso antes de tener sesión
            if (res.data?.requires_2fa === true) {
                return {
                    requires2fa: true,
                    challengeToken: res.data.challenge_token,
                    expiresIn: res.data.expires_in,
                }
            }

            applyLoginSession(res.data, res.message)
        } catch (error: any) {
            let errorMsg = "Credenciales inválidas o error de red";

            if (error?.response?.data) {
                const data = error.response.data;
                errorMsg = data.message || errorMsg;

                // Cuenta creada pero email_verified_at aún null (ver AuthController::loginMaster()/
                // loginTenant()) — no es un error de credenciales, así que no se muestra el toast
                // genérico acá: la pantalla de login intercepta este "reason" y cambia a la vista
                // de "cuenta no activada" con el botón de reenviar correo.
                if (data.details?.reason === "unverified_email") {
                    const unverifiedError: any = new Error(errorMsg);
                    unverifiedError.reason = "unverified_email";
                    throw unverifiedError;
                }

                if (data.errors) {
                    let parsedErrors = data.errors;
                    if (typeof data.errors === "string") {
                        try { parsedErrors = JSON.parse(data.errors); }
                        catch (e) { parsedErrors = null; }
                    }
                    if (parsedErrors && typeof parsedErrors === "object") {
                        const errorValues = Object.values(parsedErrors).flat();
                        if (errorValues.length > 0) {
                            // Concatenar todos los errores específicos
                            errorMsg = errorValues.join("\n");
                        }
                    }
                }
            } else if (error?.message) {
                errorMsg = error.message;
            } else if (typeof error === "string") {
                errorMsg = error;
            }

            console.error("Login error final:", errorMsg, error);
            showToast(errorMsg, "error");
            // Lanza un Error con el mensaje extraído para que la vista lo capture correctamente
            throw new Error(errorMsg);
        }
    }

    // ✅ Segundo paso del login cuando la cuenta tiene 2FA activo
    const completeTwoFactorChallenge = async (
        challengeToken: string,
        credentials: Omit<TwoFactorChallengePayload, "challenge_token">
    ): Promise<void> => {
        try {
            const res = await AuthFlowService.twoFactorChallenge({ challenge_token: challengeToken, ...credentials })

            if (res.status === "error") {
                const errorMsg = res.message || "Código inválido"
                showToast(errorMsg, "error")
                throw new Error(errorMsg)
            }

            applyLoginSession(res.data, res.message)
        } catch (error: any) {
            const errorMsg = extractErrorMessage(error)
            showToast(errorMsg, "error")
            throw new Error(errorMsg)
        }
    }

    // ✅ LOGOUT
    const logout = async () => {
        // Show splash and redirect to /login after animation (no full-page reload)
        pendingLogoutRef.current = true
        setShowSplash(true)

        let logoutMsg = "Sesión cerrada"
        try {
            const res = await apiClient.post<any>("/logout", {}, { withCredentials: true })
            if (res) {
                logoutMsg = res.message || res.data?.message || "Sesión cerrada"
            }
        } catch (error: any) {
            if (error?.response?.data?.message) {
                logoutMsg = error.response.data.message;
            }
        }
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

        // Reset local user state — splash will call router.push('/login') via handleSplashDone
        setUser(null)
        showToast(logoutMsg, "success")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                completeTwoFactorChallenge,
                logout,
            }}
        >
            {/* Splash covers the screen on initial load, login, and logout */}
            {showSplash && <SplashScreen onDone={handleSplashDone} />}
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