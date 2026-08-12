"use client"

import { useState } from "react"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useTwoFactorStatus } from "@/hooks/profile/useTwoFactorStatus"
import { useProfile } from "@/hooks/profile/useProfile"
import { TwoFactorPanel } from "./TwoFactorPanel"
import { PasswordGateDialog } from "./PasswordGateDialog"

export function TwoFactorSection() {
    const { data: statusRes, isLoading } = useTwoFactorStatus()
    const { data: profileRes } = useProfile()

    const [showGate, setShowGate] = useState(false)
    const [panel, setPanel] = useState<{ open: boolean; mode: "enable" | "manage"; password: string }>({
        open: false,
        mode: "enable",
        password: "",
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-between gap-4">
                <div className="flex gap-3">
                    <Skeleton className="size-5 rounded-full shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-56" />
                    </div>
                </div>
                <Skeleton className="h-9 w-24 shrink-0" />
            </div>
        )
    }

    const status = statusRes?.data
    const enabled = status?.enabled ?? false
    const email = profileRes?.data?.email || ""

    const handleGateConfirm = (password: string) => {
        setShowGate(false)
        setPanel({ open: true, mode: enabled ? "manage" : "enable", password })
    }

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex gap-3">
                <ShieldCheck className="size-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium text-gray-900">Autenticación de dos pasos</p>
                    <p className="text-sm text-muted-foreground">Usa Google Authenticator para proteger tu cuenta.</p>
                </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                    <span
                        className={
                            enabled
                                ? "size-2 rounded-full bg-green-500"
                                : "size-2 rounded-full border border-gray-300"
                        }
                    />
                    <span className={`text-sm ${enabled ? "text-gray-900" : "text-muted-foreground"}`}>
                        {enabled ? "Activado" : "Desactivado"}
                    </span>
                </div>
                <Button
                    variant={enabled ? "outline" : "default"}
                    className={`cursor-pointer ${enabled ? "hover:bg-gray-100" : ""}`}
                    onClick={() => setShowGate(true)}
                >
                    {enabled ? "Administrar" : "Activar"}
                </Button>
            </div>

            <PasswordGateDialog
                open={showGate}
                email={email}
                onClose={() => setShowGate(false)}
                onConfirm={handleGateConfirm}
            />
            <TwoFactorPanel
                open={panel.open}
                mode={panel.mode}
                verifiedPassword={panel.password}
                onClose={() => setPanel((prev) => ({ ...prev, open: false }))}
            />
        </div>
    )
}
