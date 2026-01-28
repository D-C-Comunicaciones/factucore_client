"use client"

import { useState, useEffect, useCallback } from "react"
import { tenantService } from "@/services/tenant.service"
import type { Tenant, CreateTenantInput, UpdateTenantInput } from "@/types/tenant"
import { toast } from "sonner"

export function useTenants() {
    const [tenants, setTenants] = useState<Tenant[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchTenants = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const data = await tenantService.getAll()
            setTenants(data)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al cargar empresas"
            setError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const createTenant = useCallback(async (data: CreateTenantInput) => {
        try {
            const newTenant = await tenantService.create(data)
            setTenants((prev) => [...prev, newTenant])
            toast.success("Empresa creada exitosamente")
            return newTenant
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al crear empresa"
            toast.error(message)
            throw err
        }
    }, [])

    const updateTenant = useCallback(async (id: number, data: UpdateTenantInput) => {
        try {
            const updatedTenant = await tenantService.update(id, data)
            setTenants((prev) =>
                prev.map((tenant) => (tenant.id === id ? updatedTenant : tenant))
            )
            toast.success("Empresa actualizada exitosamente")
            return updatedTenant
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al actualizar empresa"
            toast.error(message)
            throw err
        }
    }, [])

    const toggleStatus = useCallback(async (id: number) => {
        try {
            const updatedTenant = await tenantService.toggleStatus(id)
            setTenants((prev) =>
                prev.map((tenant) => (tenant.id === id ? updatedTenant : tenant))
            )
            toast.success("Estado actualizado exitosamente")
            return updatedTenant
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al cambiar estado"
            toast.error(message)
            throw err
        }
    }, [])

    const deleteTenant = useCallback(async (id: number) => {
        try {
            await tenantService.delete(id)
            setTenants((prev) => prev.filter((tenant) => tenant.id !== id))
            toast.success("Empresa eliminada exitosamente")
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al eliminar empresa"
            toast.error(message)
            throw err
        }
    }, [])

    useEffect(() => {
        fetchTenants()
    }, [fetchTenants])

    return {
        tenants,
        isLoading,
        error,
        fetchTenants,
        createTenant,
        updateTenant,
        toggleStatus,
        deleteTenant,
    }
}
