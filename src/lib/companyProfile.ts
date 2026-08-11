import { apiClient } from "@/lib/api-client"
import type { CompanyProfileUpdatePayload, CompanyProfileUpdateResponse } from "@/types/auth"

export class CompanyProfileService {
    /**
     * PATCH /company/profile
     */
    static async update(payload: CompanyProfileUpdatePayload) {
        return apiClient.patch<CompanyProfileUpdateResponse>("/company/profile", payload)
    }
}
