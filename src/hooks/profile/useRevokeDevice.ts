import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ProfileService } from "@/lib/profile"
import { QUERY_KEYS } from "@/lib/queryKeys"
import { showToast } from "@/components/sonner/CustomToaster"
import { extractErrorMessage } from "@/lib/errors"

export function useRevokeDevice() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => ProfileService.revokeDevice(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.devices() })
            showToast("Sesión cerrada en el dispositivo", "success")
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error), "error")
        },
    })
}
