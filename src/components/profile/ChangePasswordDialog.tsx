"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLoader } from "@tabler/icons-react"
import { useChangePassword } from "@/hooks/profile/useChangePassword"
import { extractErrorMessage } from "@/lib/errors"
import { showToast } from "@/components/sonner/CustomToaster"

interface ChangePasswordDialogProps {
    open: boolean
    onClose: () => void
}

export function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
    const changePassword = useChangePassword()
    const [currentPassword, setCurrentPassword] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")

    const reset = () => {
        setCurrentPassword("")
        setPassword("")
        setPasswordConfirmation("")
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== passwordConfirmation) {
            showToast("Las contraseñas no coinciden", "error")
            return
        }

        try {
            await changePassword.mutateAsync({
                current_password: currentPassword,
                password,
                password_confirmation: passwordConfirmation,
            })
            handleClose()
        } catch (error) {
            showToast(extractErrorMessage(error), "error")
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
                    <DialogTitle>Cambiar contraseña</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="current_password">Contraseña actual</FieldLabel>
                            <Input
                                id="current_password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                autoFocus
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="new_password">Nueva contraseña (Min. 8 caracteres)</FieldLabel>
                            <Input
                                id="new_password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="new_password_confirmation">Confirmar contraseña</FieldLabel>
                            <Input
                                id="new_password_confirmation"
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                        </Field>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer bg-white hover:bg-gray-100"
                                onClick={handleClose}
                                disabled={changePassword.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="cursor-pointer"
                                disabled={changePassword.isPending || !currentPassword || !password || !passwordConfirmation}
                            >
                                {changePassword.isPending && <IconLoader className="animate-spin" />}
                                Guardar
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
