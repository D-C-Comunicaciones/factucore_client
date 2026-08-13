"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { LogoHorizontal } from "@/components/logos/LogoHorizontal"
import { AuthLinkStatus } from "@/components/auth/AuthLinkStatus"
import { PasswordResetForm } from "@/components/auth/PasswordResetForm"
import { AuthFlowService } from "@/lib/authFlow"
import { extractErrorMessage, extractFieldErrors } from "@/lib/errors"
import { showToast } from "@/components/sonner/CustomToaster"

export default function ActivateAccountPage() {
    return (
        <Suspense fallback={null}>
            <ActivateAccountContent />
        </Suspense>
    )
}

function ActivateAccountContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const token = searchParams.get("token") || ""

    const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!email || !token) {
            setStatus("invalid")
            return
        }

        AuthFlowService.validateResetToken(email, token)
            .then((res) => setStatus(res.data?.valid ? "valid" : "invalid"))
            .catch(() => setStatus("invalid"))
    }, [email, token])

    const handleSubmit = async (password: string, passwordConfirmation: string) => {
        setIsSubmitting(true)
        setFieldErrors({})
        try {
            const res = await AuthFlowService.resetPassword({
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
            })
            showToast(res.message || "Tu cuenta fue activada, inicia sesión con tu nueva contraseña.", "success")
            router.replace("/login")
        } catch (error: any) {
            if (error?.response?.status === 422 && error?.response?.data?.errors?.token) {
                setStatus("invalid")
            } else {
                setFieldErrors(extractFieldErrors(error))
                showToast(extractErrorMessage(error), "error")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-sidebar flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card className="overflow-hidden">
                    <CardContent className="px-8 py-6">
                        <div className="flex flex-col items-center gap-1 text-center mb-6">
                            <div className="mb-4 flex justify-center">
                                <LogoHorizontal className="h-14 w-auto" />
                            </div>
                            <h1 className="text-2xl font-bold">Activar cuenta</h1>
                            <p className="text-sm text-muted-foreground">
                                Crea una contraseña para activar tu cuenta.
                            </p>
                        </div>

                        <AuthLinkStatus
                            status={status}
                            expiredMessage="Este enlace de activación ya no es válido o expiró. Contacta a soporte para recibir uno nuevo."
                        >
                            <PasswordResetForm
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                submitLabel="Activar cuenta"
                                fieldErrors={fieldErrors}
                            />
                        </AuthLinkStatus>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
