"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLoader } from "@tabler/icons-react"
import { useDisableTwoFactor } from "@/hooks/perfil/useTwoFactorMutations"
import { extractErrorMessage } from "@/lib/errors"

interface TwoFactorDisableDialogProps {
    open: boolean
    onClose: () => void
}

export function TwoFactorDisableDialog({ open, onClose }: TwoFactorDisableDialogProps) {
    const disableTwoFactor = useDisableTwoFactor()
    const [password, setPassword] = useState("")
    const [code, setCode] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            await disableTwoFactor.mutateAsync({ password, code: code || undefined })
            setPassword("")
            setCode("")
            onClose()
        } catch (err) {
            setError(extractErrorMessage(err))
        }
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Desactivar autenticación de dos pasos</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="disable_password">Contraseña actual</FieldLabel>
                            <Input
                                id="disable_password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="disable_code">Código de la app (opcional)</FieldLabel>
                            <Input
                                id="disable_code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            {error && <FieldError>{error}</FieldError>}
                        </Field>
                        <Button type="submit" className="w-fit self-end" disabled={disableTwoFactor.isPending || !password}>
                            {disableTwoFactor.isPending && <IconLoader className="animate-spin" />}
                            Desactivar
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
