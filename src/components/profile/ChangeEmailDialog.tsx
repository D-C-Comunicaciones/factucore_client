"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLoader } from "@tabler/icons-react"
import { useChangeEmail } from "@/hooks/profile/useChangeEmail"
import { extractErrorMessage } from "@/lib/errors"
import { showToast } from "@/components/sonner/CustomToaster"

interface ChangeEmailDialogProps {
    open: boolean
    currentEmail: string
    onClose: () => void
}

export function ChangeEmailDialog({ open, currentEmail, onClose }: ChangeEmailDialogProps) {
    const changeEmail = useChangeEmail()
    const [newEmail, setNewEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleClose = () => {
        setNewEmail("")
        setPassword("")
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await changeEmail.mutateAsync({ new_email: newEmail, password })
            showToast(res.message || `Te enviamos un enlace de confirmación a ${newEmail}. Revisa tu bandeja de entrada para completar el cambio.`, "success")
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
                    <DialogTitle>Cambiar correo electrónico</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="current_email">Correo electrónico actual</FieldLabel>
                            <Input id="current_email" value={currentEmail} disabled readOnly />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="new_email">Nuevo correo electrónico</FieldLabel>
                            <Input
                                id="new_email"
                                type="email"
                                placeholder="Ingresa tu nuevo correo electrónico"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                autoFocus
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email_change_password">Contraseña actual</FieldLabel>
                            <Input
                                id="email_change_password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Field>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer bg-white hover:bg-gray-100"
                                onClick={handleClose}
                                disabled={changeEmail.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" className="cursor-pointer" disabled={changeEmail.isPending || !newEmail || !password}>
                                {changeEmail.isPending && <IconLoader className="animate-spin" />}
                                Guardar
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
