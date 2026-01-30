import { useEffect, useState } from "react"
import type { Plan } from "@/types/catalogs"
import { getPlans } from "@/services/catalog.service"

export function usePlans() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        getPlans()
            .then(setPlans)
            .finally(() => setIsLoading(false))
    }, [])

    return { plans, isLoading }
}
