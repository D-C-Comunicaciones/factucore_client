"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useHasPermission } from "@/hooks/useHasPermission"
import { CompanyProfileForm } from "@/components/company/CompanyProfileForm"

export default function CompanyProfilePage() {
    const router = useRouter()
    const { user } = useAuth()
    const canEdit = useHasPermission("company.profile.edit")
    const isMaster = user?.account_type === "master"

    useEffect(() => {
        if (isMaster) {
            router.replace("/configuration")
        }
    }, [isMaster, router])

    if (isMaster) return null

    return (
        <div className="flex flex-col gap-6 max-w-[800px] mx-auto py-4">
            {canEdit ? (
                <CompanyProfileForm />
            ) : (
                <div className="rounded-lg border border-gray-100 bg-white p-6 text-sm text-muted-foreground">
                    No tienes permiso para editar esta información.
                </div>
            )}
        </div>
    )
}
