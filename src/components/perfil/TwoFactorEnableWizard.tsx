"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { IconLoader } from "@tabler/icons-react"
import { useEnableTwoFactor, useConfirmTwoFactor } from "@/hooks/perfil/useTwoFactorMutations"
import { RecoveryCodesDisplay } from "./RecoveryCodesDisplay"
import { extractErrorMessage } from "@/lib/errors"

interface TwoFactorEnableWizardProps {
    open: boolean
    onClose: () => void
}

export function TwoFactorEnableWizard({ open, onClose }: TwoFactorEnableWizardProps) {
    const enableTwoFactor = useEnableTwoFactor()
    const confirmTwoFactor = useConfirmTwoFactor()

    const [step, setStep] = useState<"qr" | "code" | "recovery-codes">("qr")
    const [code, setCode] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])

    useEffect(() => {
        if (open) {
            setStep("qr")
            setCode("")
            setError(null)
            enableTwoFactor.mutate()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            const res = await confirmTwoFactor.mutateAsync({ code })
            setRecoveryCodes(res.data?.recovery_codes || [])
            setStep("recovery-codes")
        } catch (err) {
            setError(extractErrorMessage(err))
            setCode("")
        }
    }

    const enableData = enableTwoFactor.data?.data

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next && step !== "recovery-codes") onClose() }}>
            <DialogContent
                hideClose={step === "recovery-codes"}
                onPointerDownOutside={(e) => { if (step === "recovery-codes") e.preventDefault() }}
                onEscapeKeyDown={(e) => { if (step === "recovery-codes") e.preventDefault() }}
            >
                <DialogHeader>
                    <DialogTitle>Activar autenticación de dos pasos</DialogTitle>
                </DialogHeader>

                {step === "qr" && (
                    <div className="flex flex-col gap-4">
                        {enableTwoFactor.isPending && (
                            <div className="flex justify-center py-6">
                                <IconLoader className="animate-spin" />
                            </div>
                        )}
                        {enableData && (
                            <>
                                <p className="text-sm text-muted-foreground">
                                    Escanea este código QR con tu app autenticadora (Google Authenticator, Authy, etc.).
                                </p>
                                <div className="flex justify-center">
                                    <img
                                        src={`data:image/svg+xml;base64,${enableData.qr_svg}`}
                                        alt="Código QR para 2FA"
                                        className="h-48 w-48"
                                    />
                                </div>
                                <div className="text-sm">
                                    <p className="text-muted-foreground mb-1">O ingresa este código manualmente:</p>
                                    <code className="block rounded bg-muted px-3 py-2 break-all select-all">{enableData.secret}</code>
                                </div>
                                <Button type="button" onClick={() => setStep("code")} className="w-fit self-end">
                                    Continuar
                                </Button>
                            </>
                        )}
                    </div>
                )}

                {step === "code" && (
                    <form onSubmit={handleConfirm}>
                        <FieldGroup>
                            <p className="text-sm text-muted-foreground">
                                Ingresa el código de 6 dígitos que muestra tu app autenticadora.
                            </p>
                            <Field>
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6} value={code} onChange={setCode} autoFocus>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                {error && <FieldError>{error}</FieldError>}
                            </Field>
                            <Button type="submit" className="w-fit self-end" disabled={confirmTwoFactor.isPending || !code}>
                                {confirmTwoFactor.isPending && <IconLoader className="animate-spin" />}
                                Confirmar
                            </Button>
                        </FieldGroup>
                    </form>
                )}

                {step === "recovery-codes" && (
                    <RecoveryCodesDisplay codes={recoveryCodes} onAcknowledge={onClose} />
                )}
            </DialogContent>
        </Dialog>
    )
}
