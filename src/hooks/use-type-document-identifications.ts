import { useEffect, useState } from "react"
import type { TypeDocumentIdentification } from "@/types/catalogs"
import { getTypeDocumentIdentifications } from "@/services/catalog.service"

export function useTypeDocumentIdentifications() {
    const [typeDocumentIdentifications, setTypes] = useState<TypeDocumentIdentification[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        getTypeDocumentIdentifications()
            .then(setTypes)
            .finally(() => setIsLoading(false))
    }, [])

    return { typeDocumentIdentifications, isLoading }
}
