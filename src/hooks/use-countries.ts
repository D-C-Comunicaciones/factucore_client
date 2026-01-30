import { useEffect, useState } from "react"
import type { Country } from "@/types/catalogs"
import { getCountries } from "@/services/catalog.service"

export function useCountries() {
    const [countries, setCountries] = useState<Country[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        getCountries()
            .then(setCountries)
            .finally(() => setIsLoading(false))
    }, [])

    return { countries, isLoading }
}
