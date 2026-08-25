import { apiClient } from "@/lib/api-client"
import type { Permission, PermissionModuleGroup } from "@/types/permissions"

export const permissionsApi = {
    getPermissions: async (): Promise<Permission[]> => {
        const res = await apiClient.get<{ permissions: Permission[] }>("/permissions")
        return res.data?.permissions || []
    },
}

export function groupPermissionsByModule(permissions: Permission[]): PermissionModuleGroup[] {
    const byModule = new Map<string, Permission[]>()

    for (const permission of permissions) {
        const group = byModule.get(permission.module)
        if (group) {
            group.push(permission)
        } else {
            byModule.set(permission.module, [permission])
        }
    }

    return Array.from(byModule.entries()).map(([module, modulePermissions]) => ({
        module,
        permissions: modulePermissions,
    }))
}
