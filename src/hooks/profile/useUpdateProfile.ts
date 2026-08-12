import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ProfileService } from "@/lib/profile"
import { QUERY_KEYS } from "@/lib/queryKeys"
import { showToast } from "@/components/sonner/CustomToaster"
import { extractErrorMessage } from "@/lib/errors"
import type { UpdateProfilePayload } from "@/types/auth"

export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => ProfileService.updateProfile(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.me() })
            showToast("Perfil actualizado", "success")
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error), "error")
        },
    })
}
