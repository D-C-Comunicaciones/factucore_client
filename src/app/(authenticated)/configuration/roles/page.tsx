"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateRoleModal } from "@/components/roles/CreateRoleModal"
import { useRolesList } from "@/hooks/roles/useRolesList"
import { usePermissions } from "@/hooks/usePermissions"

export default function RolesPage() {
    const router = useRouter()
    const { hasPermission } = usePermissions()
    const { data: roles, isLoading } = useRolesList()
    const [showCreateModal, setShowCreateModal] = useState(false)

    return (
        <div className="flex flex-col gap-6 max-w-[1100px] mx-auto py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Roles y permisos</h1>
                    <p className="text-sm text-muted-foreground">
                        Administra los roles y los permisos a los que tendrán acceso los usuarios de tu equipo.
                    </p>
                </div>

                {hasPermission("roles.create") && (
                    <Button
                        className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Crear rol
                    </Button>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-base font-semibold text-foreground">Roles</h2>

                <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-left text-muted-foreground">
                                <th className="font-medium py-3 px-4">Rol</th>
                                <th className="font-medium py-3 px-4">Descripción</th>
                                <th className="font-medium py-3 px-4">Usuarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={3} className="py-8 px-4 text-center text-muted-foreground">
                                        Cargando roles...
                                    </td>
                                </tr>
                            )}
                            {roles?.map((role) => (
                                <tr
                                    key={role.id}
                                    onClick={() => router.push(`/configuration/roles/${role.id}`)}
                                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="py-3 px-4 align-top">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="font-normal border-transparent bg-primary/10 text-primary">
                                                {role.name}
                                            </Badge>
                                            {role.is_system_role && (
                                                <Badge variant="outline" className="font-normal text-xs">
                                                    Predeterminado
                                                </Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 align-top text-foreground max-w-[420px]">
                                        {role.description || "—"}
                                    </td>
                                    <td className="py-3 px-4 align-top text-muted-foreground whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Users2 className="w-4 h-4" />
                                            {role.users_count} {role.users_count === 1 ? "usuario" : "usuarios"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateRoleModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
        </div>
    )
}
