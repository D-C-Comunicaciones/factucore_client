import { useQuery } from "@tanstack/react-query"
import { rolesApi } from "@/lib/roles"

export function useRole(id: number | string | undefined) {
    return useQuery({
        queryKey: ["role", id],
        queryFn: () => rolesApi.getRoleById(id as number | string),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}
