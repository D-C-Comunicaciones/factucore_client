"use client"

import { useState } from "react"
import { MailWarning } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FieldDescription, FieldGroup } from "@/components/ui/field"
import { IconLoader } from "@tabler/icons-react"
import { AuthFlowService } from "@/lib/authFlow"
import { extractErrorMessage } from "@/lib/errors"
import { showToast } from "@/components/sonner/CustomToaster"

interface AccountNotActivatedNoticeProps {
    email: string
    onBackToLogin: () => void
}

// Se muestra cuando el login falla porque la cuenta existe pero todavía no fue activada
// (email_verified_at null — ver AuthController::loginMaster()/loginTenant()). El enlace de
// activación original expira a las 24h, así que el botón de reenvío es la salida normal, no
// solo un caso de error.
export function AccountNotActivatedNotice({ email, onBackToLogin }: AccountNotActivatedNoticeProps) {
    const [isSending, setIsSending] = useState(false)
    const [sent, setSent] = useState(false)

    const handleResend = async () => {
        setIsSending(true)
        try {
            const res = await AuthFlowService.resendActivation(email)
            setSent(true)
            showToast(res.message || "Enlace de activación reenviado.", "success")
        } catch (error: any) {
            showToast(extractErrorMessage(error), "error")
        } finally {
            setIsSending(false)
        }
    }

    return (
        <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center mb-2">
                <div className="mb-2 flex justify-center">
                    <MailWarning className="h-10 w-10 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold">Tu cuenta aún no ha sido activada</h1>
                <FieldDescription>
                    {sent
                        ? <>Te reenviamos el enlace de activación a <span className="font-medium text-foreground">{email}</span>. Revisa tu correo (y la carpeta de spam) — el enlace es válido por 24 horas.</>
                        : <>Revisa tu correo <span className="font-medium text-foreground">{email}</span> y haz clic en el enlace de activación que te enviamos. Si ya pasaron 24 horas, ese enlace expiró — solicita uno nuevo abajo.</>
                    }
                </FieldDescription>
            </div>

            <Button type="button" className="w-full" onClick={handleResend} disabled={isSending}>
                {isSending && <IconLoader className="animate-spin" />}
                {sent ? "Reenviar de nuevo" : "Reenviar correo de activación"}
            </Button>

            <Button type="button" variant="ghost" className="w-full" onClick={onBackToLogin} disabled={isSending}>
                Volver al inicio de sesión
            </Button>
        </FieldGroup>
    )
}
