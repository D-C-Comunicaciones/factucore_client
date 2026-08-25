import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "@/lib/users"
import { showToast } from "@/components/sonner/CustomToaster"
import { extractErrorMessage } from "@/lib/errors"
import type {
    CreateUserPayload,
    UpdateUserPayload,
    AssignUserRolesPayload,
    AssignUserPermissionsPayload,
    UpdateUserEmailPayload,
    ResetUserPasswordPayload,
} from "@/types/users"

function invalidateUsers(queryClient: ReturnType<typeof useQueryClient>, id?: number | string) {
    queryClient.invalidateQueries({ queryKey: ["users"] })
    if (id !== undefined) queryClient.invalidateQueries({ queryKey: ["user", id] })
}

export function useCreateUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateUserPayload) => usersApi.createUser(payload),
        onSuccess: (response) => {
            invalidateUsers(queryClient)
            showToast(response.message || "Usuario creado exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useUpdateUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number | string; payload: UpdateUserPayload }) =>
            usersApi.updateUser(id, payload),
        onSuccess: (response, { id }) => {
            invalidateUsers(queryClient, id)
            showToast(response.message || "Usuario actualizado exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number | string) => usersApi.deleteUser(id),
        onSuccess: (response) => {
            invalidateUsers(queryClient)
            showToast(response.message || "Usuario eliminado exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useToggleUserStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number | string) => usersApi.toggleUserStatus(id),
        onSuccess: (response, id) => {
            invalidateUsers(queryClient, id)
            showToast(response.message || "Estado actualizado exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useAssignUserRoles() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number | string; payload: AssignUserRolesPayload }) =>
            usersApi.assignUserRoles(id, payload),
        onSuccess: (response, { id }) => {
            invalidateUsers(queryClient, id)
            showToast(response.message || "Roles asignados exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useAssignUserPermissions() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number | string; payload: AssignUserPermissionsPayload }) =>
            usersApi.assignUserPermissions(id, payload),
        onSuccess: (response, { id }) => {
            invalidateUsers(queryClient, id)
            showToast(response.message || "Permisos asignados exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useResetUserPassword() {
    return useMutation({
        mutationFn: ({ id, payload }: { id: number | string; payload: ResetUserPasswordPayload }) =>
            usersApi.resetUserPassword(id, payload),
        onSuccess: (response) => showToast(response.message || "Contraseña actualizada exitosamente", "success"),
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useSendResetLink() {
    return useMutation({
        mutationFn: (id: number | string) => usersApi.sendResetLink(id),
        onSuccess: (response) => showToast(response.message || "Enlace de recuperación enviado", "success"),
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useUpdateUserEmail() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number | string; payload: UpdateUserEmailPayload }) =>
            usersApi.updateUserEmail(id, payload),
        onSuccess: (response, { id }) => {
            invalidateUsers(queryClient, id)
            showToast(response.message || "Correo actualizado exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}
