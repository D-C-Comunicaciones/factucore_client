import { apiClient } from "@/lib/api-client"
import type { Tenant, CreateTenantInput, UpdateTenantInput } from "@/types/tenant"

export class TenantService {
    private readonly basePath = "/tenants"

    async getAll(params?: { page?: number; per_page?: number }): Promise<Tenant[]> {
        // Construye la query string solo si hay params
        let url = this.basePath
        if (params && (params.page || params.per_page)) {
            const query = new URLSearchParams()
            if (params.page) query.append("page", String(params.page))
            if (params.per_page) query.append("per_page", String(params.per_page))
            url += `?${query.toString()}`
        }
        const response = await apiClient.get<any>(url)
        // Soporta ambos formatos: paginado y array plano
        if (response.data?.tenants?.data) {
            return response.data.tenants.data
        }
        if (Array.isArray(response.data?.tenants)) {
            return response.data.tenants
        }
        return []
    }

    async getById(id: string): Promise<any> {
        const response = await apiClient.get<any>(`${this.basePath}/${id}`)
        // Devuelve el objeto completo de la API (con tenant, usage, plan)
        return response.data.data
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
