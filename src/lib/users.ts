import { apiClient } from "@/lib/api-client"
import type { PaginatedData } from "@/types/api"
import type {
    TenantUserListItem,
    TenantUserDetail,
    UsersListApiData,
    PlanLimit,
    CreateUserPayload,
    UpdateUserPayload,
    AssignUserRolesPayload,
    AssignUserPermissionsPayload,
    UpdateUserEmailPayload,
    ResetUserPasswordPayload,
} from "@/types/users"

export const usersApi = {
    getUsers: async (
        params?: Record<string, any>
    ): Promise<PaginatedData<TenantUserListItem> & { plan_limit?: PlanLimit }> => {
        const response = await apiClient.get<UsersListApiData>("/users", { params })
        const { users, pagination, plan_limit } = response.data

        return {
            data: users,
            total: pagination.total,
            per_page: pagination.per_page,
            current_page: pagination.current_page,
            last_page: pagination.last_page,
            message: response.message,
            plan_limit,
        }
    },

    getUserById: async (id: number | string): Promise<TenantUserDetail> => {
        const res = await apiClient.get<{ user: TenantUserDetail }>(`/users/${id}`)
        return res.data.user
    },

    createUser: async (payload: CreateUserPayload) => {
        return apiClient.post<{ user: TenantUserDetail }>("/users", payload)
    },

    updateUser: async (id: number | string, payload: UpdateUserPayload) => {
        return apiClient.patch<{ user: TenantUserDetail }>(`/users/${id}`, payload)
    },

    deleteUser: async (id: number | string) => {
        return apiClient.delete(`/users/${id}`)
    },

    toggleUserStatus: async (id: number | string) => {
        return apiClient.post(`/users/${id}/toggle-status`)
    },

    assignUserRoles: async (id: number | string, payload: AssignUserRolesPayload) => {
        return apiClient.patch<{ user: TenantUserDetail }>(`/users/${id}/roles`, payload)
    },

    assignUserPermissions: async (id: number | string, payload: AssignUserPermissionsPayload) => {
        return apiClient.patch<{ user: TenantUserDetail }>(`/users/${id}/permissions`, payload)
    },

    resetUserPassword: async (id: number | string, payload: ResetUserPasswordPayload) => {
        return apiClient.put(`/users/${id}/password`, payload)
    },

    sendResetLink: async (id: number | string) => {
        return apiClient.post(`/users/${id}/password/send-reset-link`)
    },

    updateUserEmail: async (id: number | string, payload: UpdateUserEmailPayload) => {
        return apiClient.patch<{ user: TenantUserDetail }>(`/users/${id}/email`, payload)
    },
}
