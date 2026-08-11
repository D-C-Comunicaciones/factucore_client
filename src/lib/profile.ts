import { apiClient } from "@/lib/api-client"
import type {
    ProfileResponse,
    UpdateProfilePayload,
    ChangePasswordPayload,
    TwoFactorStatus,
    TwoFactorEnableResponse,
    TwoFactorConfirmPayload,
    TwoFactorConfirmResponse,
    TwoFactorDisablePayload,
    RecoveryCodesRegeneratePayload,
    RecoveryCodesResponse,
} from "@/types/auth"

export class ProfileService {
    /**
     * GET /profile
     */
    static async getProfile() {
        return apiClient.get<ProfileResponse>("/profile")
    }

    /**
     * PUT /profile
     */
    static async updateProfile(payload: UpdateProfilePayload) {
        return apiClient.put<ProfileResponse>("/profile", payload)
    }

    /**
     * PUT /profile/password
     */
    static async changePassword(payload: ChangePasswordPayload) {
        return apiClient.put<{ message: string }>("/profile/password", payload)
    }

    /**
     * GET /profile/two-factor
     */
    static async getTwoFactorStatus() {
        return apiClient.get<TwoFactorStatus>("/profile/two-factor")
    }

    /**
     * POST /profile/two-factor/enable
     */
    static async enableTwoFactor() {
        return apiClient.post<TwoFactorEnableResponse>("/profile/two-factor/enable")
    }

    /**
     * POST /profile/two-factor/confirm
     */
    static async confirmTwoFactor(payload: TwoFactorConfirmPayload) {
        return apiClient.post<TwoFactorConfirmResponse>("/profile/two-factor/confirm", payload)
    }

    /**
     * POST /profile/two-factor/disable
     */
    static async disableTwoFactor(payload: TwoFactorDisablePayload) {
        return apiClient.post<{ message: string }>("/profile/two-factor/disable", payload)
    }

    /**
     * POST /profile/two-factor/recovery-codes/regenerate
     */
    static async regenerateRecoveryCodes(payload: RecoveryCodesRegeneratePayload) {
        return apiClient.post<RecoveryCodesResponse>("/profile/two-factor/recovery-codes/regenerate", payload)
    }
}
