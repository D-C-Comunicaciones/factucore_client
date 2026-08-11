import { useAuth } from "@/contexts/auth-context"

/**
 * Fails closed (returns false when the user lacks the permission), unlike the
 * inline menu-visibility helper in src/app/(authenticated)/layout.tsx which
 * fails open — this hook gates edit screens, not menu items.
 */
export function useHasPermission(permission?: string): boolean {
    const { user } = useAuth()
    if (!permission) return true
    return user?.permissions?.some((p) => p.name === permission) ?? false
}
