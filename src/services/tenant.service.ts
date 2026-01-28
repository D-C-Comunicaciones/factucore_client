import { apiClient } from "@/lib/api-client"
import type { Tenant, CreateTenantInput, UpdateTenantInput } from "@/types/tenant"

export class TenantService {
    private readonly basePath = "/tenants"

    async getAll(): Promise<Tenant[]> {
        // El backend retorna { data: { tenants: { data: Tenant[] } } }
        const response = await apiClient.get<any>(this.basePath)
        // Soporta ambos formatos: paginado y array plano
        if (response.data?.tenants?.data) {
            return response.data.tenants.data
        }
        if (Array.isArray(response.data?.tenants)) {
            return response.data.tenants
        }
        return []
    }

    async getById(id: string): Promise<Tenant> {
        const response = await apiClient.get<{ tenant: Tenant }>(`${this.basePath}/${id}`)
        return response.data.tenant
    }

    async create(data: CreateTenantInput): Promise<Tenant> {
        const response = await apiClient.post<{ tenant: Tenant }>(this.basePath, data)
        return response.data.tenant
    }

    async update(id: string, data: UpdateTenantInput): Promise<Tenant> {
        const response = await apiClient.patch<{ tenant: Tenant }>(
            `${this.basePath}/${id}`,
            data
        )
        return response.data.tenant
    }

    async toggleStatus(id: string): Promise<Tenant> {
        const response = await apiClient.post<{ tenant: Tenant }>(
            `${this.basePath}/${id}/toggle-status`
        )
        return response.data.tenant
    }

    async delete(id: string): Promise<void> {
        await apiClient.delete(`${this.basePath}/${id}`)
    }
}

export const tenantService = new TenantService()
