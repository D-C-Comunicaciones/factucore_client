import { useQuery } from "@tanstack/react-query"
import { ProfileService } from "@/lib/profile"
import { QUERY_KEYS } from "@/lib/queryKeys"

export function useDevices() {
    return useQuery({
        queryKey: QUERY_KEYS.profile.devices(),
        queryFn: () => ProfileService.getDevices(),
    })
}
