"use client"

import { useCallback, useEffect, useState } from "react"
import { tenantService } from "@/services/tenant.service"
import type { Tenant, CreateTenantInput, UpdateTenantInput } from "@/types/tenant"

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

    return {
        tenants,
        isLoading,
        fetchTenants,
        createTenant,
        updateTenant,
        toggleStatus,
        deleteTenant,
    }
}
