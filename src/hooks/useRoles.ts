import { useState, useCallback } from "react"
import { rolesService, RoleInput } from "@/services/roles.service"

export function useRoles() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    const getAll = useCallback(async (params?: { page?: number; per_page?: number }) => {
        setLoading(true)
        setError(null)
        try {
            return await rolesService.getAll(params)
        } catch (e) {
            setError(e)
            throw e
        } finally {
            setLoading(false)
        }
    }, [])

    const getById = async (id: string | number) => {
        setLoading(true)
        setError(null)
        try {
            return await rolesService.getById(id)
        } catch (e) {
            setError(e)
            throw e
        } finally {
            setLoading(false)
        }
    }

    const create = async (data: RoleInput) => {
        setLoading(true)
        setError(null)
        try {
            return await rolesService.create(data)
        } catch (e) {
            setError(e)
            throw e
        } finally {
            setLoading(false)
        }
    }

    const update = async (id: string | number, data: { name: string }) => {
        setLoading(true)
        setError(null)
        try {
            return await rolesService.update(id, data)
        } catch (e) {
            setError(e)
            throw e
        } finally {
            setLoading(false)
        }
    }

    const getPermissions = async (id: string | number) => {
        setLoading(true)
        setError(null)
        try {
            return await rolesService.getPermissions(id)
        } catch (e) {
            setError(e)
            throw e
        } finally {
            setLoading(false)
        }
    }

    const assignPermissions = async (id: string | number, permissions: number[]) => {
        setLoading(true)
        setError(null)
        try {
            return await rolesService.assignPermissions(id, permissions)
        } catch (e) {
            setError(e)
            throw e
        } finally {
            setLoading(false)
        }
    }

    const syncPermissions = async (id: string | number, permissions: number[]) => {
        setLoading(true)
        setError(null)
        try {
            return await rolesService.syncPermissions(id, permissions)
        } catch (e) {
            setError(e)
            throw e
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        getAll,
        getById,
        create,
        update,
        getPermissions,
        assignPermissions,
        syncPermissions,
    }
}
