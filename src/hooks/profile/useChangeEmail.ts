import { useMutation } from "@tanstack/react-query"
import { ProfileService } from "@/lib/profile"
import type { ChangeEmailPayload } from "@/types/auth"

export function useChangeEmail() {
    return useMutation({
        mutationFn: (payload: ChangeEmailPayload) => ProfileService.changeEmail(payload),
    })
}
