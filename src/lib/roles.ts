import { apiClient } from "@/lib/api-client"
import type {
    RoleListItem,
    RoleDetail,
    CreateRolePayload,
    UpdateRolePayload,
    AssignRolePermissionsPayload,
} from "@/types/roles"

export const rolesApi = {
    getRoles: async (): Promise<RoleListItem[]> => {
        const res = await apiClient.get<{ roles: RoleListItem[] }>("/roles")
        return res.data?.roles || []
    },

    getRoleById: async (id: number | string): Promise<RoleDetail> => {
        const res = await apiClient.get<{ role: RoleDetail }>(`/roles/${id}`)
        return res.data.role
    },

    createRole: async (payload: CreateRolePayload) => {
        return apiClient.post<{ role: RoleListItem }>("/roles", payload)
    },

    updateRole: async (id: number | string, payload: UpdateRolePayload) => {
        return apiClient.patch<{ role: RoleListItem }>(`/roles/${id}`, payload)
    },

    deleteRole: async (id: number | string) => {
        return apiClient.delete(`/roles/${id}`)
    },

    assignRolePermissions: async (id: number | string, payload: AssignRolePermissionsPayload) => {
        return apiClient.patch<{ role: RoleDetail }>(`/roles/${id}/permissions`, payload)
    },
}
