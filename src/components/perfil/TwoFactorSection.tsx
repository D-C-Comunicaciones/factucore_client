"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconLoader } from "@tabler/icons-react"
import { useTwoFactorStatus } from "@/hooks/perfil/useTwoFactorStatus"
import { TwoFactorEnableWizard } from "./TwoFactorEnableWizard"
import { TwoFactorDisableDialog } from "./TwoFactorDisableDialog"
import { RecoveryCodesRegenerateDialog } from "./RecoveryCodesRegenerateDialog"

export function TwoFactorSection() {
    const { data: statusRes, isLoading } = useTwoFactorStatus()
    const [showEnableWizard, setShowEnableWizard] = useState(false)
    const [showDisableDialog, setShowDisableDialog] = useState(false)
    const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
                <IconLoader className="animate-spin" />
            </div>
        )
    }

    const status = statusRes?.data
    const enabled = status?.enabled ?? false

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                    <p className="font-medium">Autenticación de dos pasos</p>
                    <p className="text-sm text-muted-foreground">
                        {enabled ? "Activada" : "Desactivada"}
                        {enabled && status?.confirmed_at ? ` · desde ${new Date(status.confirmed_at).toLocaleDateString()}` : ""}
                    </p>
                </div>
                {!enabled && <Button onClick={() => setShowEnableWizard(true)}>Activar 2FA</Button>}
            </div>

            {enabled && (
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowDisableDialog(true)}>
                        Desactivar 2FA
                    </Button>
                    <Button variant="outline" onClick={() => setShowRegenerateDialog(true)}>
                        Regenerar códigos de recuperación
                    </Button>
                </div>
            )}

            <TwoFactorEnableWizard open={showEnableWizard} onClose={() => setShowEnableWizard(false)} />
            <TwoFactorDisableDialog open={showDisableDialog} onClose={() => setShowDisableDialog(false)} />
            <RecoveryCodesRegenerateDialog open={showRegenerateDialog} onClose={() => setShowRegenerateDialog(false)} />
        </div>
    )
}
