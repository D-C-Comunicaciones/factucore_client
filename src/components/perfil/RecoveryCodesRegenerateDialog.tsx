"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLoader } from "@tabler/icons-react"
import { useRegenerateRecoveryCodes } from "@/hooks/perfil/useTwoFactorMutations"
import { RecoveryCodesDisplay } from "./RecoveryCodesDisplay"
import { extractErrorMessage } from "@/lib/errors"

interface RecoveryCodesRegenerateDialogProps {
    open: boolean
    onClose: () => void
}

export function RecoveryCodesRegenerateDialog({ open, onClose }: RecoveryCodesRegenerateDialogProps) {
    const regenerate = useRegenerateRecoveryCodes()
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [codes, setCodes] = useState<string[] | null>(null)

    const handleClose = () => {
        setPassword("")
        setError(null)
        setCodes(null)
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            const res = await regenerate.mutateAsync({ password })
            setCodes(res.data?.recovery_codes || [])
        } catch (err) {
            setError(extractErrorMessage(err))
        }
    }

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next && !codes) handleClose() }}>
            <DialogContent
                hideClose={!!codes}
                onPointerDownOutside={(e) => { if (codes) e.preventDefault() }}
                onEscapeKeyDown={(e) => { if (codes) e.preventDefault() }}
            >
                <DialogHeader>
                    <DialogTitle>Regenerar códigos de recuperación</DialogTitle>
                </DialogHeader>

                {codes ? (
                    <RecoveryCodesDisplay codes={codes} onAcknowledge={handleClose} />
                ) : (
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <p className="text-sm text-muted-foreground">
                                Esto invalidará tus códigos de recuperación anteriores.
                            </p>
                            <Field>
                                <FieldLabel htmlFor="regenerate_password">Contraseña actual</FieldLabel>
                                <Input
                                    id="regenerate_password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {error && <FieldError>{error}</FieldError>}
                            </Field>
                            <Button type="submit" className="w-fit self-end" disabled={regenerate.isPending || !password}>
                                {regenerate.isPending && <IconLoader className="animate-spin" />}
                                Regenerar
                            </Button>
                        </FieldGroup>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
