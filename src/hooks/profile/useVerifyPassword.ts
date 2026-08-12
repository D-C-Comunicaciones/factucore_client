import { useMutation } from "@tanstack/react-query"
import { ProfileService } from "@/lib/profile"
import type { VerifyPasswordPayload } from "@/types/auth"

export function useVerifyPassword() {
    return useMutation({
        mutationFn: (payload: VerifyPasswordPayload) => ProfileService.verifyPassword(payload),
    })
}
