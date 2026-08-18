import { useQuery } from "@tanstack/react-query"
import { rolesApi } from "@/lib/roles"

export function useRolesList() {
    return useQuery({
        queryKey: ["roles"],
        queryFn: () => rolesApi.getRoles(),
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}
