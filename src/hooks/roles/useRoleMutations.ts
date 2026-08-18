import { useMutation, useQueryClient } from "@tanstack/react-query"
import { rolesApi } from "@/lib/roles"
import { showToast } from "@/components/sonner/CustomToaster"
import { extractErrorMessage } from "@/lib/errors"
import type { CreateRolePayload, UpdateRolePayload, AssignRolePermissionsPayload } from "@/types/roles"

export function useCreateRole() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateRolePayload) => rolesApi.createRole(payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] })
            showToast(response.message || "Rol creado exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useUpdateRole() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number | string; payload: UpdateRolePayload }) =>
            rolesApi.updateRole(id, payload),
        onSuccess: (response, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] })
            queryClient.invalidateQueries({ queryKey: ["role", id] })
            showToast(response.message || "Rol actualizado exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useDeleteRole() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number | string) => rolesApi.deleteRole(id),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] })
            showToast(response.message || "Rol eliminado exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}

export function useAssignRolePermissions() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number | string; payload: AssignRolePermissionsPayload }) =>
            rolesApi.assignRolePermissions(id, payload),
        onSuccess: (response, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] })
            queryClient.invalidateQueries({ queryKey: ["role", id] })
            showToast(response.message || "Permisos actualizados exitosamente", "success")
        },
        onError: (error: any) => showToast(extractErrorMessage(error), "error"),
    })
}
