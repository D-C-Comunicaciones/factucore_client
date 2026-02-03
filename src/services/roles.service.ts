import { apiClient } from "@/lib/api-client"

export interface RoleInput {
    name: string
    guard_name?: string
    all_permissions?: boolean
    permissions?: number[]
}

export class RolesService {
    private readonly basePath = "/roles"

    async getAll(params?: { page?: number; per_page?: number }) {
        let url = this.basePath
        if (params && (params.page || params.per_page)) {
            const query = new URLSearchParams()
            if (params.page) query.append("page", String(params.page))
            if (params.per_page) query.append("per_page", String(params.per_page))
            url += `?${query.toString()}`
        }
        const response = await apiClient.get<any>(url)
        // Devuelve el objeto { roles, pagination }
        return response.data.data
    }

    async getById(id: string | number) {
        const response = await apiClient.get<any>(`${this.basePath}/${id}`)
        return response.data.data
    }

    async create(data: RoleInput) {
        const response = await apiClient.post<any>(this.basePath, data)
        return response.data.data
    }

    async update(id: string | number, data: { name: string }) {
        const response = await apiClient.patch<any>(`${this.basePath}/${id}`, data)
        return response.data.data
    }

    async getPermissions(id: string | number) {
        const response = await apiClient.get<any>(`${this.basePath}/${id}/permissions`)
        return response.data.data.permissions
    }

    async assignPermissions(id: string | number, permissions: number[]) {
        const response = await apiClient.post<any>(`${this.basePath}/${id}/permissions`, { permissions })
        return response.data.data
    }

    async syncPermissions(id: string | number, permissions: number[]) {
        const response = await apiClient.post<any>(`${this.basePath}/${id}/permissions/sync`, { permissions })
        return response.data.data
    }
}

export const rolesService = new RolesService()
