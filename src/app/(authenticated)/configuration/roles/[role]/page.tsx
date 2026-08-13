"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Copy, Pencil, MoreVertical, Info, ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ROLES,
    MODULE_ACCESS,
    PERMISSION_TABS,
    isPermissionChecked,
    type PermissionGroup,
} from "@/data/roles"

function PermissionGroupCard({ group, roleName }: { group: PermissionGroup; roleName: keyof typeof MODULE_ACCESS.Ventas }) {
    const [open, setOpen] = useState(true)
    const access = MODULE_ACCESS[group.module][roleName]
    const allChecked = group.items.every((item, i) => isPermissionChecked(i, item.label, access))

    return (
        <div className="rounded-lg border border-gray-100 overflow-hidden">
            <div
                role="button"
                tabIndex={0}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setOpen((o) => !o)
                    }
                }}
                className="w-full flex items-center justify-between gap-3 bg-gray-50 px-4 py-3 text-left cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{group.name}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-muted-foreground">
                        {group.items.length} Permisos relacionados
                    </span>
                </div>
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-not-allowed">
                        <Checkbox checked={allChecked} disabled />
                        Seleccionar todos
                    </label>
                    {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
            </div>

            {open && (
                <div className="p-4 flex flex-col gap-3">
                    {group.items.map((item, i) => {
                        const checked = isPermissionChecked(i, item.label, access)
                        return (
                            <label key={item.id} className="flex items-center gap-2 text-sm text-muted-foreground cursor-not-allowed">
                                <Checkbox checked={checked} disabled />
                                {item.label}
                                <HelpCircle className="w-3.5 h-3.5 text-gray-300" />
                            </label>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default function RolePermissionsPage() {
    const params = useParams<{ role: string }>()
    const role = ROLES.find((r) => r.slug === params.role)

    if (!role) {
        return (
            <div className="flex flex-col gap-4 max-w-[1100px] mx-auto py-4">
                <Link href="/configuration/roles" className="inline-flex items-center gap-1 text-sm text-primary hover:underline w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a roles
                </Link>
                <p className="text-sm text-muted-foreground">No se encontró el rol solicitado.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 max-w-[1100px] mx-auto py-4">
            <div className="flex flex-col gap-2">
                <Link href="/configuration/roles" className="inline-flex items-center gap-1 text-sm text-primary hover:underline w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a roles
                </Link>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Permisos del rol {role.name}</h1>
                        <p className="text-sm text-muted-foreground">Visualiza los permisos que tiene el rol seleccionado.</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="cursor-pointer hover:bg-gray-100">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-popover border border-border">
                                <DropdownMenuItem disabled className="text-muted-foreground">
                                    Eliminar rol
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="outline"
                            disabled
                            title="Actualiza tu plan para duplicar roles"
                            className="cursor-not-allowed text-gray-400"
                        >
                            <Copy className="w-4 h-4 mr-1" />
                            Duplicar
                        </Button>
                        <Button variant="outline" className="cursor-pointer hover:bg-gray-100">
                            <Pencil className="w-4 h-4 mr-1" />
                            Editar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-6 flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">Información básica del rol</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="role-name">Nombre del rol</Label>
                        <input
                            id="role-name"
                            readOnly
                            value={role.name}
                            className="h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-foreground"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="role-description">Descripción del rol</Label>
                        <input
                            id="role-description"
                            readOnly
                            value={role.description}
                            className="h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-foreground"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-6 flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">Permisos del rol</h2>

                <Tabs defaultValue={PERMISSION_TABS[0].key}>
                    <TabsList>
                        {PERMISSION_TABS.map((tab) => (
                            <TabsTrigger key={tab.key} value={tab.key}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {PERMISSION_TABS.map((tab) => {
                        const allTabChecked = tab.groups.every((group) => {
                            const access = MODULE_ACCESS[group.module][role.name]
                            return group.items.every((item, i) => isPermissionChecked(i, item.label, access))
                        })

                        return (
                            <TabsContent key={tab.key} value={tab.key} className="flex flex-col gap-4 mt-4">
                                <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                    Al activar un permiso, otros relacionados pueden activarse automáticamente.
                                </div>

                                <label className="flex items-center gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm text-muted-foreground cursor-not-allowed">
                                    <Checkbox checked={allTabChecked} disabled />
                                    Seleccionar todos
                                </label>

                                {tab.groups.map((group) => (
                                    <PermissionGroupCard key={group.name} group={group} roleName={role.name} />
                                ))}
                            </TabsContent>
                        )
                    })}
                </Tabs>
            </div>
        </div>
    )
}
