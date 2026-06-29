import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "@/lib/items";
import { showToast } from "@/components/sonner/CustomToaster";
import { CreateItemPayload } from "@/types/items";

export function useCreateItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateItemPayload) => itemsApi.createItem(payload),
        onSuccess: (response) => {
            if (response.status === "success") {
                queryClient.invalidateQueries({ queryKey: ["items"] });
                showToast("Ítem creado correctamente", "success");
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error al crear el ítem";
            showToast(message, "error");
        },
    });
}
