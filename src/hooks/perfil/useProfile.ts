import { useQuery } from "@tanstack/react-query"
import { ProfileService } from "@/lib/profile"
import { QUERY_KEYS } from "@/lib/queryKeys"

export function useProfile() {
    return useQuery({
        queryKey: QUERY_KEYS.profile.me(),
        queryFn: () => ProfileService.getProfile(),
    })
}
