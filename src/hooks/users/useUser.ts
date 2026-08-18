import { useQuery } from "@tanstack/react-query"
import { usersApi } from "@/lib/users"

export function useUser(id: number | string | undefined) {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => usersApi.getUserById(id as number | string),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}
