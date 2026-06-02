import { apiClient } from "@/lib/api-client";
import {
    ItemResponse,
    CreateItemPayload,
    UpdateItemPayload,
    UpdateVariantPayload,
    ItemListResponse,
    GetItemByIdResponse
} from "@/types/items";
import { PaginatedData } from "@/types/api";

export const itemsApi = {
    /**
     * Obtiene la lista de ítems paginada
     */
    getItems: async (
        params?: Record<string, any>
    ) => {
        const response =
            await apiClient.get<
                PaginatedData<ItemListResponse>
            >("/items", {
                params,
            });

        return response.data;
    },

    /**
     * Obtiene un ítem por ID
     */
    getItemById: async (id: number | string) => {
        return apiClient.get<GetItemByIdResponse>(`/items/${id}`);
    },

    /**
     * Crea un nuevo ítem (Simple, con Variantes o Combo)
     */
    createItem: async (payload: CreateItemPayload) => {
        return apiClient.post<ItemResponse>("/items", payload);
    },

    /**
     * Actualiza un ítem existente (Sync Inteligente)
     */
    updateItem: async (id: number | string, payload: Partial<UpdateItemPayload>) => {
        return apiClient.patch<ItemResponse>(`/items/${id}`, payload);
    },

    /**
     * Alterna el estado activo/inactivo de un ítem
     */
    toggleItemStatus: async (id: number | string) => {
        return apiClient.post<any>(`/items/${id}/toggle-status`);
    },

    /**
     * Elimina un ítem
     */
    deleteItem: async (id: number | string) => {
        return apiClient.delete<any>(`/items/${id}`);
    },

    /**
     * Actualiza una variante específica
     */
    updateVariant: async (id: number | string, payload: UpdateVariantPayload) => {
        return apiClient.patch<any>(`/item-variants/${id}`, payload);
    },

    /**
     * Alterna el estado activo/inactivo de una variante
     */
    toggleVariantStatus: async (id: number | string) => {
        return apiClient.post<any>(`/item-variants/${id}/toggle-status`);
    }
};
