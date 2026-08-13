"use client"

import { useRouter } from "next/navigation"
import { Plus, Users2, MoreVertical, Sparkles, Check, Minus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROLES, MODULE_ACCESS, ACCESS_LABEL, AccessLevel } from "@/data/roles"

const MODULES = Object.entries(MODULE_ACCESS).map(([name, access]) => ({ name, access }))

function AccessCell({ level }: { level: AccessLevel }) {
    if (level === "none") {
        return <Minus className="w-4 h-4 text-gray-300 mx-auto" />
    }
    if (level === "full") {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                <Check className="w-3.5 h-3.5" />
                {ACCESS_LABEL[level]}
            </span>
        )
    }
    return <span className="text-xs font-medium text-muted-foreground">{ACCESS_LABEL[level]}</span>
}

export default function RolesPage() {
    const router = useRouter()

    return (
        <div className="flex flex-col gap-6 max-w-[1100px] mx-auto py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Roles y permisos</h1>
                    <p className="text-sm text-muted-foreground">
                        Administra los roles y los permisos a los que tendrán acceso los usuarios de tu equipo.
                    </p>
                </div>

                <Button
                    disabled
                    title="Actualiza tu plan para crear roles personalizados"
                    className="shrink-0 bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Crear rol
                </Button>
            </div>

            <Tabs defaultValue="roles">
                <TabsList>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                    <TabsTrigger value="permisos">Permisos</TabsTrigger>
                </TabsList>

                <TabsContent value="roles" className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-muted/40 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <Sparkles className="size-8 shrink-0 text-primary" />
                            <p className="text-sm text-foreground">
                                <span className="font-semibold">Configura los roles y permisos de tu equipo</span>
                                <br />
                                <span className="text-muted-foreground">
                                    Visualiza los roles predeterminados y los permisos que tiene asignado cada uno.
                                </span>
                            </p>
                        </div>
                        <Button className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                            Crear Rol
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h2 className="text-base font-semibold text-foreground">Roles predeterminados</h2>

                        <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left text-muted-foreground">
                                        <th className="font-medium py-3 px-4">Rol</th>
                                        <th className="font-medium py-3 px-4">Descripción</th>
                                        <th className="font-medium py-3 px-4">Usuarios</th>
                                        <th className="w-10 py-3 px-4" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {ROLES.map((role) => (
                                        <tr
                                            key={role.name}
                                            onClick={() => router.push(`/configuration/roles/${role.slug}`)}
                                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                        >
                                            <td className="py-3 px-4 align-top">
                                                <Badge variant="outline" className="font-normal border-transparent bg-primary/10 text-primary">
                                                    {role.name}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 align-top text-foreground max-w-[420px]">{role.description}</td>
                                            <td className="py-3 px-4 align-top text-muted-foreground whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Users2 className="w-4 h-4" />
                                                    {role.users} {role.users === 1 ? "usuario" : "usuarios"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 align-top text-right" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 bg-popover border border-border">
                                                        <DropdownMenuItem
                                                            onClick={() => router.push(`/configuration/roles/${role.slug}`)}
                                                            className="hover:bg-primary/10 hover:text-primary transition-colors"
                                                        >
                                                            <Pencil className="w-4 h-4 mr-2" />
                                                            Editar rol
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="permisos" className="flex flex-col gap-4 mt-4">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Permisos por módulo</h2>
                        <p className="text-sm text-muted-foreground">
                            Consulta qué acceso tiene cada rol en las distintas secciones de la plataforma.
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-white overflow-hidden overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left text-muted-foreground">
                                    <th className="font-medium py-3 px-4">Módulo</th>
                                    {ROLES.map((role) => (
                                        <th key={role.name} className="font-medium py-3 px-4 text-center whitespace-nowrap">
                                            {role.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MODULES.map((mod) => (
                                    <tr key={mod.name} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-foreground whitespace-nowrap">{mod.name}</td>
                                        {ROLES.map((role) => (
                                            <td key={role.name} className="py-3 px-4 text-center">
                                                <AccessCell level={mod.access[role.name]} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
