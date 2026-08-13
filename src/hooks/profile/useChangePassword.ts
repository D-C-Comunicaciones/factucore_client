import { useMutation } from "@tanstack/react-query"
import { ProfileService } from "@/lib/profile"
import { showToast } from "@/components/sonner/CustomToaster"
import { extractErrorMessage } from "@/lib/errors"
import type { ChangePasswordPayload } from "@/types/auth"

export function useChangePassword() {
    return useMutation({
        mutationFn: (payload: ChangePasswordPayload) => ProfileService.changePassword(payload),
        onSuccess: () => {
            showToast("Contraseña actualizada. Tus otras sesiones fueron cerradas.", "success")
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error), "error")
        },
    })
}
