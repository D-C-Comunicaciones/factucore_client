"use client"

import { useEffect, useState } from "react"
import { Plus, MoreVertical, Eye, Pencil, Power, KeyRound, Mail, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FilterSelect } from "@/components/ui/filter-select"
import { Skeleton } from "@/components/ui/skeleton"
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
import { UserInfoPanel } from "@/components/users/UserInfoPanel"
import { CreateUserModal } from "@/components/users/CreateUserModal"
import { ChangeUserEmailDialog } from "@/components/users/ChangeUserEmailDialog"
import { ResetUserPasswordDialog } from "@/components/users/ResetUserPasswordDialog"
import { useUsersList } from "@/hooks/users/useUsersList"
import { useRolesList } from "@/hooks/roles/useRolesList"
import { useDeleteUser, useToggleUserStatus } from "@/hooks/users/useUserMutations"
import { usePermissions } from "@/hooks/usePermissions"
import type { TenantUserListItem } from "@/types/users"

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
}

export default function UsersPage() {
    const { hasPermission } = usePermissions()

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [page, setPage] = useState(1)

    const [detailUserId, setDetailUserId] = useState<number | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<TenantUserListItem | null>(null)
    const [emailTarget, setEmailTarget] = useState<TenantUserListItem | null>(null)
    const [passwordTarget, setPasswordTarget] = useState<TenantUserListItem | null>(null)

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 400)
        return () => clearTimeout(timeout)
    }, [search])

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, roleFilter, statusFilter])

    const params: Record<string, any> = { per_page: 20, page }
    if (debouncedSearch) params.search = debouncedSearch
    if (roleFilter !== "all") params.role = roleFilter
    if (statusFilter !== "all") params.active = statusFilter === "active"

    const { data, isLoading } = useUsersList(params)
    const { data: roles } = useRolesList()
    const deleteUser = useDeleteUser()
    const toggleStatus = useToggleUserStatus()

    const users = data?.data ?? []
    const planLimit = data?.plan_limit
    const atCap = !!planLimit && !planLimit.unlimited && planLimit.max_users !== null && planLimit.used >= planLimit.max_users

    async function handleDeleteConfirm() {
        if (!deleteTarget) return
        await deleteUser.mutateAsync(deleteTarget.id)
        setDeleteTarget(null)
    }

    return (
        <div className="flex flex-col gap-6 max-w-[1100px] mx-auto py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
                    <p className="text-sm text-muted-foreground">
                        Crea nuevos usuarios y asigna roles para administrar sus permisos.
                    </p>
                </div>

                {hasPermission("users.create") && (
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            disabled={atCap}
                            title={atCap ? "Alcanzaste el máximo de usuarios de tu Plan actual" : undefined}
                            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Crear usuario
                        </Button>
                    </div>
                )}
            </div>

            {planLimit && (
                <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4">
                    <div className="relative flex size-16 shrink-0 items-center justify-center">
                        <svg className="size-16" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" className="text-gray-200" strokeWidth="3" />
                            <circle
                                cx="18"
                                cy="18"
                                r="15.5"
                                fill="none"
                                stroke="currentColor"
                                className="text-primary"
                                strokeWidth="3"
                                strokeDasharray={
                                    planLimit.unlimited
                                        ? "97.4 97.4"
                                        : `${Math.min(planLimit.used / (planLimit.max_users || 1), 1) * 97.4} 97.4`
                                }
                                strokeLinecap="round"
                                transform="rotate(-90 18 18)"
                            />
                        </svg>
                        <span className="absolute text-sm font-bold text-foreground">
                            {planLimit.used}/{planLimit.unlimited ? "∞" : planLimit.max_users}
                        </span>
                    </div>
                    <p className="text-sm text-foreground">
                        <span className="font-semibold">Usuarios creados</span>{" "}
                        <span className="text-muted-foreground">
                            {planLimit.unlimited
                                ? "Tu plan permite usuarios ilimitados."
                                : "Haz crecer tu equipo creando más usuarios."}
                        </span>
                    </p>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-3 md:items-center">
                <Input
                    placeholder="Buscar por nombre o correo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="md:max-w-xs"
                />
                <FilterSelect
                    value={roleFilter}
                    onValueChange={setRoleFilter}
                    className="md:w-48"
                    placeholder="Rol"
                    options={[
                        { value: "all", label: "Todos los roles" },
                        ...(roles?.map((role) => ({ value: role.name, label: role.name })) ?? []),
                    ]}
                />
                <FilterSelect
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    className="md:w-40"
                    placeholder="Estado"
                    options={[
                        { value: "all", label: "Todos" },
                        { value: "active", label: "Activos" },
                        { value: "inactive", label: "Inactivos" },
                    ]}
                />
            </div>

            <div className="flex flex-col gap-3">
                <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-left text-muted-foreground">
                                <th className="font-medium py-3 px-4">Usuario</th>
                                <th className="font-medium py-3 px-4">Roles</th>
                                <th className="font-medium py-3 px-4">Estado</th>
                                <th className="font-medium py-3 px-4">Último acceso</th>
                                <th className="w-10 py-3 px-4" />
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading &&
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-gray-100 last:border-b-0">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="size-9 shrink-0 rounded-full" />
                                                <div className="flex flex-col gap-1.5">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-40" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Skeleton className="h-5 w-20 rounded-full" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <Skeleton className="h-4 w-24" />
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Skeleton className="h-7 w-7 rounded-md ml-auto" />
                                        </td>
                                    </tr>
                                ))}
                            {!isLoading && users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 px-4 text-center text-muted-foreground">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    onClick={() => setDetailUserId(user.id)}
                                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                                                {getInitials(user.name) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((roleName) => (
                                                <Badge
                                                    key={roleName}
                                                    variant="outline"
                                                    className="font-normal border-transparent bg-primary/10 text-primary"
                                                >
                                                    {roleName}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge
                                            variant="outline"
                                            className={
                                                user.active
                                                    ? "font-normal border-transparent bg-emerald-50 text-emerald-600"
                                                    : "font-normal border-transparent bg-gray-100 text-gray-500"
                                            }
                                        >
                                            {user.active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                                        {user.last_login_at || "Nunca"}
                                    </td>
                                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer hover:bg-gray-100">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 bg-popover border border-border">
                                                <DropdownMenuItem onClick={() => setDetailUserId(user.id)}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Ver detalle
                                                </DropdownMenuItem>
                                                {hasPermission("users.edit") && (
                                                    <DropdownMenuItem onClick={() => setDetailUserId(user.id)}>
                                                        <Pencil className="w-4 h-4 mr-2" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                )}
                                                {hasPermission("users.toggle-status") && (
                                                    <DropdownMenuItem onClick={() => toggleStatus.mutate(user.id)}>
                                                        <Power className="w-4 h-4 mr-2" />
                                                        {user.active ? "Desactivar" : "Activar"}
                                                    </DropdownMenuItem>
                                                )}
                                                {hasPermission("users.password.reset") && (
                                                    <DropdownMenuItem onClick={() => setPasswordTarget(user)}>
                                                        <KeyRound className="w-4 h-4 mr-2" />
                                                        Restablecer contraseña
                                                    </DropdownMenuItem>
                                                )}
                                                {hasPermission("users.email.update") && (
                                                    <DropdownMenuItem onClick={() => setEmailTarget(user)}>
                                                        <Mail className="w-4 h-4 mr-2" />
                                                        Cambiar correo
                                                    </DropdownMenuItem>
                                                )}
                                                {hasPermission("users.delete") && (
                                                    <DropdownMenuItem
                                                        onClick={() => setDeleteTarget(user)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {data && data.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Página {data.current_page} de {data.last_page} · {data.total} usuarios
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={page >= data.last_page}
                                onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <UserInfoPanel
                open={detailUserId !== null}
                onClose={() => setDetailUserId(null)}
                userId={detailUserId}
            />

            <CreateUserModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />

            {emailTarget && (
                <ChangeUserEmailDialog
                    open={!!emailTarget}
                    onClose={() => setEmailTarget(null)}
                    userId={emailTarget.id}
                    currentEmail={emailTarget.email}
                />
            )}

            {passwordTarget && (
                <ResetUserPasswordDialog
                    open={!!passwordTarget}
                    onClose={() => setPasswordTarget(null)}
                    userId={passwordTarget.id}
                />
            )}

            <AlertDialog open={!!deleteTarget} onOpenChange={(next) => !next && setDeleteTarget(null)}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar a {deleteTarget?.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Si es el único administrador activo, el sistema
                            impedirá la eliminación.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer hover:bg-gray-100" disabled={deleteUser.isPending}>Cancelar</AlertDialogCancel>
                        <Button variant="destructive" className="cursor-pointer" disabled={deleteUser.isPending} onClick={handleDeleteConfirm}>
                            {deleteUser.isPending ? "Eliminando..." : "Eliminar usuario"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
