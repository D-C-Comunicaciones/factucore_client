import { useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"

export function usePermissions() {
    const { user } = useAuth()

    const hasModule = useCallback(
        (moduleCode?: string) => {
            if (!moduleCode) return true
            return user?.modules?.includes(moduleCode) ?? true
        },
        [user]
    )

    const hasPermission = useCallback(
        (permission?: string) => {
            if (!permission) return true
            return user?.permissions?.some((p) => p.name === permission) ?? true
        },
        [user]
    )

    return { hasModule, hasPermission }
}
