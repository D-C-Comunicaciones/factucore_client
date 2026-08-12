"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { IconLoader } from "@tabler/icons-react"
import { Upload } from "lucide-react"
import { useProfile } from "@/hooks/profile/useProfile"
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile"
import { extractFieldErrors } from "@/lib/errors"
import type { ProfileTenant } from "@/types/auth"

function isTenantProfile(profile: any): profile is ProfileTenant {
    return profile && "phone" in profile
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "?"
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function PersonalDataSection() {
    const { data: profileRes, isLoading } = useProfile()
    const updateProfile = useUpdateProfile()

    const profile = profileRes?.data
    const isTenant = isTenantProfile(profile)

    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const resetDraft = () => {
        if (!profile) return
        setName(profile.name || "")
        if (isTenantProfile(profile)) setPhone(profile.phone || "")
    }

    useEffect(() => {
        resetDraft()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile])

    if (isLoading) {
        return (
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <Skeleton className="w-20 h-20 rounded-full" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
            </div>
        )
    }

    const handleCancel = () => {
        setFieldErrors({})
        resetDraft()
        setIsEditing(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFieldErrors({})
        try {
            await updateProfile.mutateAsync(isTenant ? { name, phone } : { name })
            setIsEditing(false)
        } catch (error: any) {
            setFieldErrors(extractFieldErrors(error))
        }
    }

    const initials = getInitials(profile?.name || "")

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-foreground">Información general</h2>
                {!isEditing && (
                    <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                        Editar
                    </Button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {initials}
                    </div>
                    {isEditing && (
                        <Button type="button" variant="outline" size="sm" disabled className="gap-1.5">
                            <Upload className="size-3.5" />
                            Subir foto
                        </Button>
                    )}
                </div>

                <div className="flex-1">
                    {isEditing ? (
                        <FieldGroup>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                    {fieldErrors.name && <FieldError>{fieldErrors.name}</FieldError>}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                                    <Input id="email" value={profile?.email || ""} disabled readOnly />
                                </Field>

                                {isTenant && (
                                    <Field>
                                        <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                        {fieldErrors.phone && <FieldError>{fieldErrors.phone}</FieldError>}
                                    </Field>
                                )}

                                {!isTenant && profile && (
                                    <Field>
                                        <FieldLabel htmlFor="level">Nivel</FieldLabel>
                                        <Input id="level" value={(profile as any).level || ""} disabled readOnly />
                                    </Field>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={handleCancel} disabled={updateProfile.isPending}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={updateProfile.isPending}>
                                    {updateProfile.isPending && <IconLoader className="animate-spin" />}
                                    Guardar
                                </Button>
                            </div>
                        </FieldGroup>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                                <p className="text-sm font-medium text-foreground">{profile?.name || "No registrado"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Correo electrónico</p>
                                <p className="text-sm font-medium text-foreground">{profile?.email || "No registrado"}</p>
                            </div>
                            {isTenant && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                                    <p className="text-sm font-medium text-foreground">{(profile as ProfileTenant).phone || "No registrado"}</p>
                                </div>
                            )}
                            {!isTenant && profile && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Nivel</p>
                                    <p className="text-sm font-medium text-foreground">{(profile as any).level || "No registrado"}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
}
