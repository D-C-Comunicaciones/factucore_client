import { useEffect, useState } from "react"
import type { Municipality } from "@/types/catalogs"
import { getMunicipalities } from "@/services/catalog.service"

export function useMunicipalities(departmentId: string | number) {
    const [municipalities, setMunicipalities] = useState<Municipality[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!departmentId) {
            setMunicipalities([])
            return
        }
        setIsLoading(true)
        getMunicipalities(departmentId)
            .then(setMunicipalities)
            .finally(() => setIsLoading(false))
    }, [departmentId])

    return { municipalities, isLoading }
}
