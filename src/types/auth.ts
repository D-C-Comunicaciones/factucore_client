// Types for the password recovery / activation / 2FA / profile feature (see prompt.md)

export interface ValidateResetTokenResponse {
    valid: boolean
    purpose: "password_reset" | "tenant_activation"
}

export interface ForgotPasswordResponse {
    message: string
}

export interface ResetPasswordPayload {
    email: string
    token: string
    password: string
    password_confirmation: string
}

export interface ResetPasswordResponse {
    message: string
}

export interface LoginRequires2FA {
    requires_2fa: true
    challenge_token: string
    expires_in: number
}

export interface TwoFactorChallengePayload {
    challenge_token: string
    code?: string
    recovery_code?: string
}

export interface ProfileTenant {
    id: number
    name: string
    email: string
    phone: string | null
    avatar: string | null
    two_factor: { enabled: boolean }
}

export interface ProfileMaster {
    id: number
    name: string
    email: string
    level: string
    two_factor: { enabled: boolean }
}

export type ProfileResponse = ProfileTenant | ProfileMaster

export interface UpdateProfilePayload {
    name?: string
    phone?: string
    avatar?: string
}

export interface ChangePasswordPayload {
    current_password: string
    password: string
    password_confirmation: string
}

export interface TwoFactorStatus {
    enabled: boolean
    confirmed_at: string | null
    pending_setup: boolean
}

export interface TwoFactorEnableResponse {
    secret: string
    otpauth_uri: string
    qr_svg: string
}

export interface TwoFactorConfirmPayload {
    code: string
}

export interface TwoFactorConfirmResponse {
    recovery_codes: string[]
}

export interface TwoFactorDisablePayload {
    password: string
    code?: string
}

export interface RecoveryCodesRegeneratePayload {
    password: string
}

export interface RecoveryCodesResponse {
    recovery_codes: string[]
}

export interface CompanyProfileUpdatePayload {
    company_name?: string
    identification_number?: number
    verification_digit?: number
    email?: string
    phone?: string
    address?: string
    postal_code?: string
    merchant_registration?: string
    municipality_id?: number
    type_document_identification_id?: number
    // New fields from the UI
    person_type?: string
    first_name?: string
    second_name?: string
    last_name?: string
    nationality_type?: string
    tax_responsibility?: string
    website?: string
    currency?: string
    employees_count?: string
    sector?: string
    department_id?: number
}

export interface CompanyProfileUpdateResponse {
    company: Record<string, any>
}
