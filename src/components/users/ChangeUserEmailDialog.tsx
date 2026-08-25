"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useUpdateUserEmail } from "@/hooks/users/useUserMutations"
import { extractFieldErrors } from "@/lib/errors"

interface ChangeUserEmailDialogProps {
    open: boolean
    onClose: () => void
    userId: number
    currentEmail: string
}

export function ChangeUserEmailDialog({ open, onClose, userId, currentEmail }: ChangeUserEmailDialogProps) {
    const [email, setEmail] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const updateEmail = useUpdateUserEmail()

    function handleClose() {
        setEmail("")
        setFieldErrors({})
        onClose()
    }

    async function handleSubmit() {
        setFieldErrors({})
        try {
            await updateEmail.mutateAsync({ id: userId, payload: { email } })
            handleClose()
        } catch (error: any) {
            setFieldErrors(extractFieldErrors(error))
        }
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Cambiar correo</DialogTitle>
                    <DialogDescription>
                        Correo actual: {currentEmail}. Se notificará a esta dirección por transparencia y se cerrarán las sesiones activas del usuario.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="new-email">Nuevo correo *</FieldLabel>
                        <Input
                            id="new-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={!!fieldErrors.email}
                        />
                        <FieldError errors={fieldErrors.email ? [{ message: fieldErrors.email }] : undefined} />
                    </Field>
                </FieldGroup>

                <DialogFooter>
                    <Button type="button" variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="button" className="cursor-pointer" disabled={!email || updateEmail.isPending} onClick={handleSubmit}>
                        {updateEmail.isPending ? "Guardando..." : "Cambiar correo"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
