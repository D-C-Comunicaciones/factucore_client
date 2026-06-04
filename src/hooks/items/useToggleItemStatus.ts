import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "@/lib/items";
import { showToast } from "@/components/sonner/CustomToaster";

export interface ToggleStatusParams {
    entityType?: "item" | "variant";
    ids: number | number[];
    isActive?: boolean;
}

export function useToggleItemStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ entityType = "item", ids, isActive }: ToggleStatusParams) =>
            itemsApi.toggleEntityStatus(entityType, ids, isActive),
        onSuccess: (response) => {
            if (response.data?.status === "success" || response.status === 200) {
                queryClient.invalidateQueries({ queryKey: ["items"] });
                showToast("Estado actualizado exitosamente", "success");
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error al cambiar el estado";
            showToast(message, "error");
        },
    });
}
