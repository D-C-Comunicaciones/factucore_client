import { useEffect, useState } from "react"
import type { Department } from "@/types/catalogs"
import { getDepartments } from "@/services/catalog.service"

export function useDepartments(countryId: string | number) {
    const [departments, setDepartments] = useState<Department[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!countryId) {
            setDepartments([])
            return
        }
        setIsLoading(true)
        getDepartments(countryId)
            .then(setDepartments)
            .finally(() => setIsLoading(false))
    }, [countryId])

    return { departments, isLoading }
}
