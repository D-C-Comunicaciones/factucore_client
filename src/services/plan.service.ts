import { apiClient } from "@/lib/api-client"

export type Plan = {
    id: number
    name: string
    description: string
    is_unlimited: boolean
    has_unlimited_documents: boolean
    has_unlimited_users: boolean
    has_unlimited_amount: boolean
    max_documents: number
    max_users: number
    max_amount: string
    price: string
    is_active: boolean
    sort_order: number
    tenants_count: number
    active_tenants_count: number
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export class PlanService {
    private readonly basePath = "/catalogs/plans"
    private readonly planPath = "/plans"

    async getAll(): Promise<Plan[]> {
        const response = await apiClient.get<any>(this.basePath)
        return response.data?.plans ?? []
    }

    async getById(id: number): Promise<Plan | null> {
        const response = await apiClient.get<any>(`${this.planPath}/${id}`)
        return response.data?.plan ?? null
    }

    async update(id: number, data: Partial<Plan>): Promise<Plan> {
        const response = await apiClient.patch<any>(`${this.planPath}/${id}`, data)
        return response.data?.plan
    }

    async toggleStatus(id: number): Promise<Plan> {
        const response = await apiClient.post<any>(`${this.planPath}/${id}/toggle-status`)
        return response.data?.plan
    }
}

export const planService = new PlanService()
