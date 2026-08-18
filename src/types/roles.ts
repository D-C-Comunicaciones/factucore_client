import type { Permission, PermissionModuleGroup } from "@/types/permissions"

export interface RoleListItem {
    id: number
    name: string
    description: string | null
    is_system_role: boolean
    users_count: number
    permissions: string[]
}

export interface RoleDetail {
    id: number
    name: string
    description: string | null
    is_system_role: boolean
    users_count: number
    permissions: Permission[]
    permissions_by_module: PermissionModuleGroup[]
}

export interface CreateRolePayload {
    name: string
    description?: string | null
}

export interface UpdateRolePayload {
    name: string
    description?: string | null
}

export interface AssignRolePermissionsPayload {
    permission_ids: number[]
}
