"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLoader } from "@tabler/icons-react"
import { AuthFlowService } from "@/lib/authFlow"
import { extractErrorMessage } from "@/lib/errors"
import { showToast } from "@/components/sonner/CustomToaster"
import { useVerifyPassword } from "@/hooks/profile/useVerifyPassword"

interface PasswordGateDialogProps {
    open: boolean
    email: string
    onClose: () => void
    onConfirm: (password: string) => void
}

export function PasswordGateDialog({ open, email, onClose, onConfirm }: PasswordGateDialogProps) {
    const verifyPassword = useVerifyPassword()
    const [password, setPassword] = useState("")
    const [isSendingReset, setIsSendingReset] = useState(false)

    const handleClose = () => {
        setPassword("")
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await verifyPassword.mutateAsync({ password })
            onConfirm(password)
            setPassword("")
        } catch (error) {
            showToast(extractErrorMessage(error), "error")
        }
    }

    const handleForgotPassword = async () => {
        if (!email) return
        setIsSendingReset(true)
        try {
            const res = await AuthFlowService.forgotPassword(email)
            showToast(res.message || `Te enviamos un enlace para restablecer tu contraseña a ${email}`, "success")
        } catch (error) {
            showToast(extractErrorMessage(error), "error")
        } finally {
            setIsSendingReset(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
            <DialogContent
                className="bg-white"
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Ingresa tu contraseña actual</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground -mt-2">
                    Por seguridad te pediremos que ingreses tu contraseña para realizar cambios en tu información de inicio de sesión
                </p>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="gate_password">Ingresa tu contraseña</FieldLabel>
                            <Input
                                id="gate_password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                required
                            />
                        </Field>
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            disabled={isSendingReset}
                            className="text-sm text-primary underline underline-offset-2 w-fit disabled:opacity-50 cursor-pointer"
                        >
                            {isSendingReset ? "Enviando..." : "¿Olvidaste tu contraseña?"}
                        </button>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer bg-white hover:bg-gray-100"
                                onClick={handleClose}
                                disabled={verifyPassword.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" className="cursor-pointer" disabled={verifyPassword.isPending || !password}>
                                {verifyPassword.isPending && <IconLoader className="animate-spin" />}
                                Continuar
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
