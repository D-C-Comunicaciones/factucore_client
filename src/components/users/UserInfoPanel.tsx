"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Crown } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ROLES, type RoleName } from "@/data/roles"

interface UserInfoPanelProps {
    open: boolean
    onClose: () => void
    user: {
        name: string
        email: string
        role: RoleName
    }
}

export function UserInfoPanel({ open, onClose, user }: UserInfoPanelProps) {
    const router = useRouter()
    const [name, setName] = useState(user.name)
    const [whatsapp, setWhatsapp] = useState("")
    const [role, setRole] = useState<RoleName>(user.role)

    const selectedRole = ROLES.find((r) => r.name === role)

    const handleClose = () => {
        setName(user.name)
        setWhatsapp("")
        setRole(user.role)
        onClose()
    }

    return (
        <Sheet open={open} onOpenChange={(next) => !next && handleClose()}>
            <SheetContent
                className="w-full sm:max-w-md bg-white flex flex-col p-0 gap-0"
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <SheetHeader>
                    <SheetTitle>Información de {user.name}</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="user-name">Nombre de usuario *</FieldLabel>
                            <Input id="user-name" value={name} onChange={(e) => setName(e.target.value)} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="user-email">Correo *</FieldLabel>
                            <Input id="user-email" value={user.email} disabled />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="user-whatsapp">
                                WhatsApp (opcional)
                                <span className="ml-1 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                    BETA
                                </span>
                            </FieldLabel>
                            <div className="flex gap-2">
                                <Select defaultValue="+57">
                                    <SelectTrigger className="w-24 shrink-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+57">🇨🇴 +57</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    id="user-whatsapp"
                                    placeholder="300 123 4567"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                />
                            </div>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="user-role">Rol asignado *</FieldLabel>
                            <Select value={role} onValueChange={(v) => setRole(v as RoleName)}>
                                <SelectTrigger id="user-role" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map((r) => (
                                        <SelectItem key={r.name} value={r.name}>
                                            {r.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedRole && (
                                <button
                                    type="button"
                                    onClick={() => router.push(`/configuration/roles/${selectedRole.slug}`)}
                                    className="text-sm text-primary hover:underline w-fit inline-flex items-center gap-1"
                                >
                                    Ver permisos de este rol
                                    <span aria-hidden>↗</span>
                                </button>
                            )}
                        </Field>
                    </FieldGroup>

                    <div className="rounded-lg border border-gray-100 bg-muted/40 p-4 flex flex-col items-center gap-2 text-center">
                        <div className="flex size-9 items-center justify-center rounded-md bg-white border border-gray-100">
                            <Crown className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-foreground">¡Crea roles únicos para tu equipo!</p>
                        <Button size="sm" className="cursor-pointer" onClick={() => router.push("/configuration/roles")}>
                            Gestionar Roles
                        </Button>
                    </div>
                </div>

                <SheetFooter className="border-t flex-row justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled
                            title="Actualiza tu plan para inhabilitar usuarios"
                            className="text-gray-400 cursor-not-allowed"
                        >
                            Inhabilitar usuario
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            disabled
                            title="Actualiza tu plan para eliminar usuarios"
                            className="text-gray-400 cursor-not-allowed"
                        >
                            Eliminar usuario
                        </Button>
                    </div>
                    <Button type="button" className="cursor-pointer" onClick={handleClose}>
                        Guardar cambios
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
