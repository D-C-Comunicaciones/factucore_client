import { useCallback, useEffect, useState } from "react"
import { planService, Plan } from "@/services/plan.service"

export function usePlans() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchPlans = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await planService.getAll()
            setPlans(data)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPlans()
    }, [fetchPlans])

    const updatePlan = async (id: number, input: Partial<Plan>) => {
        await planService.update(id, input)
        await fetchPlans()
    }

    const toggleStatus = async (id: number) => {
        await planService.toggleStatus(id)
        await fetchPlans()
    }

    const getPlan = async (id: number) => {
        return await planService.getById(id)
    }

    return {
        plans,
        isLoading,
        fetchPlans,
        updatePlan,
        toggleStatus,
        getPlan,
    }
}
