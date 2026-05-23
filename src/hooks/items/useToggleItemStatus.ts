import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "@/lib/items";
import { showToast } from "@/components/sonner/CustomToaster";

export function useToggleItemStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => itemsApi.toggleItemStatus(id),
        onSuccess: (response) => {
            if (response.status === "success") {
                queryClient.invalidateQueries({ queryKey: ["items"] });
                showToast("Estado del ítem actualizado", "success");
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error al cambiar el estado";
            showToast(message, "error");
        },
    });
}
