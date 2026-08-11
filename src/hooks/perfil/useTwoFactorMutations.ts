import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ProfileService } from "@/lib/profile"
import { QUERY_KEYS } from "@/lib/queryKeys"
import { showToast } from "@/components/sonner/CustomToaster"
import { extractErrorMessage } from "@/lib/errors"
import type {
    TwoFactorConfirmPayload,
    TwoFactorDisablePayload,
    RecoveryCodesRegeneratePayload,
} from "@/types/auth"

export function useEnableTwoFactor() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => ProfileService.enableTwoFactor(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.twoFactor() })
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error), "error")
        },
    })
}

export function useConfirmTwoFactor() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: TwoFactorConfirmPayload) => ProfileService.confirmTwoFactor(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.twoFactor() })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.me() })
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error), "error")
        },
    })
}

export function useDisableTwoFactor() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: TwoFactorDisablePayload) => ProfileService.disableTwoFactor(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.twoFactor() })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.me() })
            showToast("Autenticación de dos pasos desactivada", "success")
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error), "error")
        },
    })
}

export function useRegenerateRecoveryCodes() {
    return useMutation({
        mutationFn: (payload: RecoveryCodesRegeneratePayload) => ProfileService.regenerateRecoveryCodes(payload),
        onError: (error: any) => {
            showToast(extractErrorMessage(error), "error")
        },
    })
}
