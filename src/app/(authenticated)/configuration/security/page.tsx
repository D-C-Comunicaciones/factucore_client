"use client"

import { useState } from "react"
import { Mail, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfile } from "@/hooks/profile/useProfile"
import { TwoFactorSection } from "@/components/profile/TwoFactorSection"
import { ChangeEmailDialog } from "@/components/profile/ChangeEmailDialog"
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog"
import { ConnectedDevicesSection } from "@/components/profile/ConnectedDevicesSection"

export default function SecurityPage() {
    const { data: profileRes, isLoading } = useProfile()
    const [showEmailDialog, setShowEmailDialog] = useState(false)
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)

    const email = profileRes?.data?.email || ""

    return (
        <div className="flex flex-col gap-6 max-w-[800px] mx-auto py-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Acceso a tu cuenta</h1>
                <p className="text-sm text-muted-foreground">Configura tu contraseña y protege tu cuenta.</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <h2 className="text-sm font-semibold text-foreground text-left pb-3 mb-4 border-b">Métodos de verificación</h2>

                    {isLoading ? (
                        <div className="flex flex-col divide-y">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className="flex gap-3">
                                        <Skeleton className="size-5 rounded-full shrink-0 mt-0.5" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-40" />
                                            <Skeleton className="h-3 w-64" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-9 w-24 shrink-0" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y">
                            <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
                                <div className="flex gap-3">
                                    <Mail className="size-5 text-gray-900 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Correo electrónico</p>
                                        <p className="text-sm text-muted-foreground">
                                            Actualiza o cambia tu correo electrónico si lo necesitas para recibir códigos de verificación
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-sm text-muted-foreground hidden sm:inline">{email}</span>
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer hover:bg-gray-100"
                                        onClick={() => setShowEmailDialog(true)}
                                    >
                                        Administrar
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 py-4">
                                <div className="flex gap-3">
                                    <Lock className="size-5 text-gray-900 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Contraseña</p>
                                        <p className="text-sm text-muted-foreground">Usa tu contraseña para iniciar sesión en tu cuenta.</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => setShowPasswordDialog(true)}
                                >
                                    Administrar
                                </Button>
                            </div>

                            <div className="py-4 last:pb-0">
                                <TwoFactorSection />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <ConnectedDevicesSection />
                </CardContent>
            </Card>

            <ChangeEmailDialog open={showEmailDialog} currentEmail={email} onClose={() => setShowEmailDialog(false)} />
            <ChangePasswordDialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} />
        </div>
    )
}
