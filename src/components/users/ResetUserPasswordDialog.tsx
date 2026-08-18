"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useResetUserPassword, useSendResetLink } from "@/hooks/users/useUserMutations"
import { extractFieldErrors } from "@/lib/errors"

interface ResetUserPasswordDialogProps {
    open: boolean
    onClose: () => void
    userId: number
}

export function ResetUserPasswordDialog({ open, onClose, userId }: ResetUserPasswordDialogProps) {
    const [password, setPassword] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const resetPassword = useResetUserPassword()
    const sendResetLink = useSendResetLink()

    function handleClose() {
        setPassword("")
        setFieldErrors({})
        onClose()
    }

    async function handleReset() {
        setFieldErrors({})
        try {
            await resetPassword.mutateAsync({ id: userId, payload: { password } })
            handleClose()
        } catch (error: any) {
            setFieldErrors(extractFieldErrors(error))
        }
    }

    async function handleSendLink() {
        await sendResetLink.mutateAsync(userId)
        handleClose()
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Restablecer contraseña</DialogTitle>
                    <DialogDescription>
                        Fija una nueva contraseña directamente o envía un enlace de recuperación al correo del usuario.
                        Fijar una contraseña cierra las sesiones activas.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="reset-password">Nueva contraseña</FieldLabel>
                        <Input
                            id="reset-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-invalid={!!fieldErrors.password}
                        />
                        <FieldError errors={fieldErrors.password ? [{ message: fieldErrors.password }] : undefined} />
                    </Field>
                </FieldGroup>

                <DialogFooter className="sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        disabled={sendResetLink.isPending}
                        onClick={handleSendLink}
                    >
                        {sendResetLink.isPending ? "Enviando..." : "Enviar enlace en su lugar"}
                    </Button>
                    <Button type="button" className="cursor-pointer" disabled={!password || resetPassword.isPending} onClick={handleReset}>
                        {resetPassword.isPending ? "Guardando..." : "Restablecer contraseña"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
