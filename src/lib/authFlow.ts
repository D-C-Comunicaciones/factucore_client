import { apiClient } from "@/lib/api-client"
import type {
    ValidateResetTokenResponse,
    ForgotPasswordResponse,
    ResetPasswordPayload,
    ResetPasswordResponse,
    TwoFactorChallengePayload,
} from "@/types/auth"

export class AuthFlowService {
    /**
     * GET /auth/password/validate
     */
    static async validateResetToken(email: string, token: string) {
        const params = new URLSearchParams({ email, token }).toString()
        return apiClient.get<ValidateResetTokenResponse>(`/auth/password/validate?${params}`)
    }

    /**
     * POST /auth/password/forgot
     */
    static async forgotPassword(email: string) {
        return apiClient.post<ForgotPasswordResponse>("/auth/password/forgot", { email })
    }

    /**
     * POST /auth/password/reset
     */
    static async resetPassword(payload: ResetPasswordPayload) {
        return apiClient.post<ResetPasswordResponse>("/auth/password/reset", payload)
    }

    /**
     * POST /auth/2fa/challenge
     * Response shape is identical to a successful login — kept loosely typed
     * so auth-context can handle it with the same code path as login.
     */
    static async twoFactorChallenge(payload: TwoFactorChallengePayload) {
        return apiClient.post<any>("/auth/2fa/challenge", payload)
    }
}
