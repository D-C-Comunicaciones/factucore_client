import { apiClient } from "@/lib/api-client"
import type { Tenant, CreateTenantInput, UpdateTenantInput } from "@/types/tenant"

export class TenantService {
    private readonly basePath = "/tenants"

    async getAll(): Promise<Tenant[]> {
        const response = await apiClient.get<{ tenants: Tenant[] }>(this.basePath)
        return response.data.tenants
    }

    async getById(id: number): Promise<Tenant> {
        const response = await apiClient.get<{ tenant: Tenant }>(`${this.basePath}/${id}`)
        return response.data.tenant
    }

    async create(data: CreateTenantInput): Promise<Tenant> {
        const response = await apiClient.post<{ tenant: Tenant }>(this.basePath, data)
        return response.data.tenant
    }

    async update(id: number, data: UpdateTenantInput): Promise<Tenant> {
        const response = await apiClient.patch<{ tenant: Tenant }>(
            `${this.basePath}/${id}`,
            data
        )
        return response.data.tenant
    }

    async toggleStatus(id: number): Promise<Tenant> {
        const response = await apiClient.post<{ tenant: Tenant }>(
            `${this.basePath}/${id}/toggle-status`
        )
        return response.data.tenant
    }

    async delete(id: number): Promise<void> {
        await apiClient.delete(`${this.basePath}/${id}`)
    }
}

export const tenantService = new TenantService()
