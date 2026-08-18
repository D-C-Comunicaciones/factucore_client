"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { RoleListbox } from "@/components/users/RoleListbox"
import { useUser } from "@/hooks/users/useUser"
import { useRolesList } from "@/hooks/roles/useRolesList"
import { usePermissionsCatalogByModule } from "@/hooks/permissions/usePermissionsCatalog"
import {
    useUpdateUser,
    useAssignUserRoles,
    useAssignUserPermissions,
    useToggleUserStatus,
    useDeleteUser,
} from "@/hooks/users/useUserMutations"
import { usePermissions } from "@/hooks/usePermissions"

interface UserInfoPanelProps {
    open: boolean
    onClose: () => void
    userId: number | null
}

export function UserInfoPanel({ open, onClose, userId }: UserInfoPanelProps) {
    const { hasPermission } = usePermissions()
    const { data: user } = useUser(userId ?? undefined)
    const { data: roles } = useRolesList()
    const { groups: permissionGroups, data: permissionsCatalog } = usePermissionsCatalogByModule()

    const updateUser = useUpdateUser()
    const assignRoles = useAssignUserRoles()
    const assignPermissions = useAssignUserPermissions()
    const toggleStatus = useToggleUserStatus()
    const deleteUser = useDeleteUser()

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [roleIds, setRoleIds] = useState<Set<number>>(new Set())
    const [permissionIds, setPermissionIds] = useState<Set<number>>(new Set())
    const [rejectedIds, setRejectedIds] = useState<Set<number>>(new Set())
    const [showPermissions, setShowPermissions] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        if (!user) return
        setName(user.name)
        setPhone(user.phone || "")
        setRoleIds(new Set((roles || []).filter((r) => user.roles.includes(r.name)).map((r) => r.id)))
        setRejectedIds(new Set())
    }, [user, roles])

    useEffect(() => {
        if (!user || !permissionsCatalog) return
        setPermissionIds(
            new Set(permissionsCatalog.filter((p) => user.direct_permissions.includes(p.name)).map((p) => p.id))
        )
    }, [user, permissionsCatalog])

    const isAdminRole = user?.roles.includes("admin") ?? false

    function handleClose() {
        setShowDeleteConfirm(false)
        onClose()
    }

    async function handleSaveBasicInfo() {
        if (!userId) return
        await updateUser.mutateAsync({ id: userId, payload: { name, phone: phone || undefined } })
    }

    async function handleSaveRoles() {
        if (!userId) return
        await assignRoles.mutateAsync({ id: userId, payload: { role_ids: Array.from(roleIds) } })
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
        if (!userId) return
        setRejectedIds(new Set())
        try {
            await assignPermissions.mutateAsync({ id: userId, payload: { permission_ids: Array.from(permissionIds) } })
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
        if (!userId) return
        await deleteUser.mutateAsync(userId)
        handleClose()
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
                    <SheetTitle>Información de {user?.name ?? "usuario"}</SheetTitle>
                </SheetHeader>

                {!user ? (
                    <p className="px-4 py-6 text-sm text-muted-foreground">Cargando información del usuario...</p>
                ) : (
                    <>
                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="user-name">Nombre *</FieldLabel>
                            <Input
                                id="user-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!hasPermission("users.edit")}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="user-email">Correo</FieldLabel>
                            <Input id="user-email" value={user.email} disabled />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="user-phone">Teléfono (opcional)</FieldLabel>
                            <Input
                                id="user-phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={!hasPermission("users.edit")}
                            />
                        </Field>

                        {hasPermission("users.edit") && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="w-fit"
                                disabled={updateUser.isPending}
                                onClick={handleSaveBasicInfo}
                            >
                                {updateUser.isPending ? "Guardando..." : "Guardar nombre y teléfono"}
                            </Button>
                        )}

                        <Field>
                            <FieldLabel>Roles</FieldLabel>
                            <RoleListbox
                                roles={roles || []}
                                selectedIds={roleIds}
                                disabled={!hasPermission("users.roles.assign")}
                                onToggle={(id) =>
                                    setRoleIds((prev) => {
                                        const next = new Set(prev)
                                        if (next.has(id)) next.delete(id)
                                        else next.add(id)
                                        return next
                                    })
                                }
                            />
                            {hasPermission("users.roles.assign") && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="w-fit"
                                    disabled={assignRoles.isPending}
                                    onClick={handleSaveRoles}
                                >
                                    {assignRoles.isPending ? "Guardando..." : "Guardar roles"}
                                </Button>
                            )}
                        </Field>
                    </FieldGroup>

                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={() => setShowPermissions((v) => !v)}
                            className="flex items-center justify-between text-sm font-semibold text-foreground"
                        >
                            Permisos directos
                            {showPermissions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showPermissions && (
                            <div className="flex flex-col gap-3">
                                {isAdminRole && (
                                    <p className="text-xs text-muted-foreground rounded-md bg-muted/40 p-3">
                                        Este usuario tiene el rol admin: sus permisos se recalculan automáticamente
                                        según el Plan del tenant.
                                    </p>
                                )}
                                {permissionGroups.map((group) => (
                                    <PermissionModuleGroup
                                        key={group.module}
                                        module={group.module}
                                        permissions={group.permissions}
                                        selectedIds={permissionIds}
                                        rejectedIds={rejectedIds}
                                        disabled={!hasPermission("users.permissions.assign")}
                                        onToggle={togglePermission}
                                        onToggleAll={toggleAllInGroup}
                                        defaultOpen={false}
                                    />
                                ))}
                                {hasPermission("users.permissions.assign") && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="w-fit"
                                        disabled={assignPermissions.isPending}
                                        onClick={handleSavePermissions}
                                    >
                                        {assignPermissions.isPending ? "Guardando..." : "Guardar permisos"}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {user.all_permissions.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-semibold text-foreground">Permisos efectivos</p>
                            <div className="flex flex-wrap gap-1">
                                {user.all_permissions.map((permissionName) => (
                                    <Badge key={permissionName} variant="outline" className="font-normal text-xs">
                                        {permissionName}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <SheetFooter className="border-t flex-row justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {hasPermission("users.toggle-status") && (
                            <Button
                                type="button"
                                variant="outline"
                                disabled={toggleStatus.isPending}
                                onClick={() => userId && toggleStatus.mutate(userId)}
                            >
                                {user.active ? "Inhabilitar usuario" : "Activar usuario"}
                            </Button>
                        )}
                        {hasPermission("users.delete") && (
                            <Button
                                type="button"
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                Eliminar usuario
                            </Button>
                        )}
                    </div>
                    <Button type="button" onClick={handleClose}>
                        Cerrar
                    </Button>
                </SheetFooter>

                <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar a {user.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Si es el único administrador activo, el sistema
                                impedirá la eliminación.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer hover:bg-gray-100" disabled={deleteUser.isPending}>Cancelar</AlertDialogCancel>
                            <Button variant="destructive" className="cursor-pointer" disabled={deleteUser.isPending} onClick={handleDelete}>
                                {deleteUser.isPending ? "Eliminando..." : "Eliminar usuario"}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
