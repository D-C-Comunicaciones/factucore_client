import { useQuery } from "@tanstack/react-query"
import { usersApi } from "@/lib/users"

export function useUsersList(params?: Record<string, any>) {
    const paramsKey = JSON.stringify(params ?? {})

    return useQuery({
        queryKey: ["users", paramsKey],
        queryFn: () => usersApi.getUsers(params),
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}
