import { useMutation } from "@tanstack/react-query"
import { CompanyProfileService } from "@/lib/companyProfile"
import { AuthService } from "@/lib/auth"
import { showToast } from "@/components/sonner/CustomToaster"
import { extractErrorMessage } from "@/lib/errors"
import type { CompanyProfileUpdatePayload } from "@/types/auth"

export function useUpdateCompanyProfile() {
    return useMutation({
        mutationFn: (payload: CompanyProfileUpdatePayload) => CompanyProfileService.update(payload),
        onSuccess: (response) => {
            if (response.data?.company) {
                AuthService.setCompany(response.data.company)
            }
            showToast("Empresa actualizada", "success")
        },
        onError: (error: any) => {
            if (error?.response?.status === 403) {
                showToast("No tienes permiso para editar esta información", "error")
                return
            }
            showToast(extractErrorMessage(error), "error")
        },
    })
}
