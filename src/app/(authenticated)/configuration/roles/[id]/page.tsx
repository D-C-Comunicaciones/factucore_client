"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PermissionModuleGroup } from "@/components/roles/PermissionModuleGroup"
import { useRole } from "@/hooks/roles/useRole"
import { usePermissionsCatalogByModule } from "@/hooks/permissions/usePermissionsCatalog"
import { useUpdateRole, useDeleteRole, useAssignRolePermissions } from "@/hooks/roles/useRoleMutations"
import { usePermissions } from "@/hooks/usePermissions"

export default function RoleDetailPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const { hasPermission } = usePermissions()

    const { data: role, isLoading } = useRole(params.id)
    const { groups: permissionGroups, data: permissionsCatalog } = usePermissionsCatalogByModule()

    const updateRole = useUpdateRole()
    const deleteRole = useDeleteRole()
    const assignPermissions = useAssignRolePermissions()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [permissionIds, setPermissionIds] = useState<Set<number>>(new Set())
    const [rejectedIds, setRejectedIds] = useState<Set<number>>(new Set())
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        if (!role) return
        setName(role.name)
        setDescription(role.description || "")
        setPermissionIds(new Set(role.permissions.map((p) => p.id)))
        setRejectedIds(new Set())
    }, [role])

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 max-w-[1100px] mx-auto py-4">
                <p className="text-sm text-muted-foreground">Cargando rol...</p>
            </div>
        )
    }

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

    const isAdminRole = role.name === "admin"
    const canEditBasicInfo = hasPermission("roles.edit") && !role.is_system_role
    const canEditPermissions = hasPermission("roles.permissions.assign") && !isAdminRole
    const canDelete = hasPermission("roles.delete") && !role.is_system_role && role.users_count === 0

    async function handleSaveInfo() {
        await updateRole.mutateAsync({ id: role!.id, payload: { name, description: description || undefined } })
    }

    function togglePermission(id: number) {
        setPermissionIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    function toggleAllInGroup(ids: number[], checked: boolean) {
        setPermissionIds((prev) => {
            const next = new Set(prev)
            ids.forEach((id) => (checked ? next.add(id) : next.delete(id)))
            return next
        })
    }

    async function handleSavePermissions() {
        setRejectedIds(new Set())
        try {
            await assignPermissions.mutateAsync({ id: role!.id, payload: { permission_ids: Array.from(permissionIds) } })
        } catch (error: any) {
            const outsidePlan: string[] = error?.response?.data?.permissions_outside_plan
            if (outsidePlan && permissionsCatalog) {
                setRejectedIds(
                    new Set(permissionsCatalog.filter((p) => outsidePlan.includes(p.name)).map((p) => p.id))
                )
            }
        }
    }

    async function handleDelete() {
        await deleteRole.mutateAsync(role!.id)
        router.push("/configuration/roles")
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
                        <p className="text-sm text-muted-foreground">
                            {role.users_count} {role.users_count === 1 ? "usuario asignado" : "usuarios asignados"}
                        </p>
                    </div>

                    {hasPermission("roles.delete") && (
                        <div className="flex items-center gap-2 shrink-0">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="cursor-pointer hover:bg-gray-100">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-popover border border-border">
                                    <DropdownMenuItem
                                        disabled={!canDelete}
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="text-destructive"
                                        title={
                                            role.is_system_role
                                                ? "Los roles predeterminados no se pueden eliminar"
                                                : role.users_count > 0
                                                  ? "Reasigna a los usuarios de este rol antes de eliminarlo"
                                                  : undefined
                                        }
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar rol
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-6 flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">Información básica del rol</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="role-name">Nombre del rol</Label>
                        <Input
                            id="role-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!canEditBasicInfo}
                            title={role.is_system_role ? "Los roles predeterminados no se pueden renombrar" : undefined}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="role-description">Descripción del rol</Label>
                        <Input
                            id="role-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={!canEditBasicInfo}
                        />
                    </div>
                </div>
                {canEditBasicInfo && (
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-fit"
                        disabled={!name || updateRole.isPending}
                        onClick={handleSaveInfo}
                    >
                        <Pencil className="w-4 h-4 mr-1" />
                        {updateRole.isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                )}
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-6 flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">Permisos del rol</h2>

                {isAdminRole && (
                    <p className="text-sm text-muted-foreground rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                        Los permisos del rol admin se administran automáticamente según el Plan del tenant y no se
                        pueden editar manualmente.
                    </p>
                )}

                <div className="flex flex-col gap-4">
                    {permissionGroups.map((group) => (
                        <PermissionModuleGroup
                            key={group.module}
                            module={group.module}
                            permissions={group.permissions}
                            selectedIds={permissionIds}
                            rejectedIds={rejectedIds}
                            disabled={!canEditPermissions}
                            onToggle={togglePermission}
                            onToggleAll={toggleAllInGroup}
                        />
                    ))}
                </div>

                {canEditPermissions && (
                    <Button
                        type="button"
                        className="w-fit"
                        disabled={assignPermissions.isPending}
                        onClick={handleSavePermissions}
                    >
                        {assignPermissions.isPending ? "Guardando..." : "Guardar permisos"}
                    </Button>
                )}
            </div>

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar el rol {role.name}?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer hover:bg-gray-100" disabled={deleteRole.isPending}>Cancelar</AlertDialogCancel>
                        <Button variant="destructive" className="cursor-pointer" disabled={deleteRole.isPending} onClick={handleDelete}>
                            {deleteRole.isPending ? "Eliminando..." : "Eliminar rol"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
