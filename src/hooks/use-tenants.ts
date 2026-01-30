"use client"

import { useCallback, useEffect, useState } from "react"
import { tenantService } from "@/services/tenant.service"
import type { Tenant, CreateTenantInput, UpdateTenantInput } from "@/types/tenant"

export interface TenantShowApiResponse {
    tenant: any // Puedes tipar mejor si tienes el tipo completo
    usage?: any
    plan?: any
}

export function useTenants() {
    const [tenants, setTenants] = useState<Tenant[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchTenants = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await tenantService.getAll()
            setTenants(data)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTenants()
    }, [fetchTenants])

    const createTenant = async (input: CreateTenantInput) => {
        await tenantService.create(input)
        await fetchTenants()
    }

    const updateTenant = async (id: string, input: UpdateTenantInput) => {
        await tenantService.update(id, input)
        await fetchTenants()
    }

    const toggleStatus = async (id: string) => {
        await tenantService.toggleStatus(id)
        await fetchTenants()
    }

    const deleteTenant = async (id: string) => {
        await tenantService.delete(id)
        await fetchTenants()
    }

    // Nuevo método show para obtener un tenant por id y mapearlo
    const show = async (id: string): Promise<TenantShowApiResponse | null> => {
        try {
            const response = await tenantService.getById(id)
            // Si la respuesta ya es el objeto completo, retorna tal cual
            // Si necesitas mapear, hazlo aquí
            return response as TenantShowApiResponse
        } catch (error) {
            return null
        }
    }

    return {
        tenants,
        isLoading,
        fetchTenants,
        createTenant,
        updateTenant,
        toggleStatus,
        deleteTenant,
        show,
    }
}
