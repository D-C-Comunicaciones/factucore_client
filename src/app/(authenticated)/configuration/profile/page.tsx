"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { PersonalDataSection } from "@/components/perfil/PersonalDataSection"
import { ChangePasswordSection } from "@/components/perfil/ChangePasswordSection"
import { TwoFactorSection } from "@/components/perfil/TwoFactorSection"
import { CollapsibleSection } from "@/components/perfil/CollapsibleSection"

export default function ProfilePage() {
    const searchParams = useSearchParams()
    const openSeguridad = searchParams.get("tab") === "seguridad"

    return (
        <div className="flex flex-col gap-6 max-w-[800px] mx-auto py-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Mi perfil</h1>
            </div>

            <Card>
                <CardContent className="p-6">
                    <PersonalDataSection />
                </CardContent>
            </Card>

            <CollapsibleSection title="Cambiar contraseña">
                <ChangePasswordSection />
            </CollapsibleSection>

            <CollapsibleSection title="Seguridad" defaultOpen={openSeguridad}>
                <TwoFactorSection />
            </CollapsibleSection>
        </div>
    )
}
