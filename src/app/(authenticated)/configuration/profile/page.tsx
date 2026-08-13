"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PersonalDataSection } from "@/components/profile/PersonalDataSection"

export default function ProfilePage() {
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
        </div>
    )
}
