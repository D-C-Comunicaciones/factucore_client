import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "@/lib/items";
import { showToast } from "@/components/sonner/CustomToaster";

export function useUpdateItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number | string; payload: any }) => 
            itemsApi.updateItem(id, payload),
        onSuccess: (response) => {
            if (response.status === "success") {
                queryClient.invalidateQueries({ queryKey: ["items"] });
                showToast("Ítem actualizado correctamente", "success");
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error al actualizar el ítem";
            showToast(message, "error");
        },
    });
}
