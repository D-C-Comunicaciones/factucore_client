import { useQuery } from "@tanstack/react-query"
import { ProfileService } from "@/lib/profile"
import { QUERY_KEYS } from "@/lib/queryKeys"

export function useTwoFactorStatus() {
    return useQuery({
        queryKey: QUERY_KEYS.profile.twoFactor(),
        queryFn: () => ProfileService.getTwoFactorStatus(),
    })
}
