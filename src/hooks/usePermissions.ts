import { useState } from "react"
import { permissionsService } from "@/services/permissions.service"

export function usePermissions() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    const getAll = async () => {
        setLoading(true)
        setError(null)
        try {
            return await permissionsService.getAll()
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
    }
}
