import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "@/lib/items";
import { showToast } from "@/components/sonner/CustomToaster";

export function useDeleteItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => itemsApi.deleteItem(id),
        onSuccess: (response) => {
            if (response.status === "success") {
                queryClient.invalidateQueries({ queryKey: ["items"] });
                showToast("Ítem eliminado correctamente", "success");
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error al eliminar el ítem";
            showToast(message, "error");
        },
    });
}
