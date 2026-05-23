import { apiClient } from "./api-client";
import { Item } from "@/types/items";
import { ApiResponse, PaginatedData } from "@/types/api";

export const itemsApi = {
    /**
     * Obtiene la lista de ítems paginada
     */
    getItems: async (params?: Record<string, any>) => {
        const response = await apiClient.get<PaginatedData<Item>>("/items", { params });
        return response.data;
    },

    /**
     * Obtiene un ítem por ID
     */
    getItemById: async (id: number | string) => {
        return apiClient.get<Item>(`/items/${id}`);
    },

    /**
     * Crea un nuevo ítem (Simple, con Variantes o Combo)
     */
    createItem: async (payload: any) => {
        return apiClient.post<Item>("/items", payload);
    },

    /**
     * Actualiza un ítem existente (Sync Inteligente)
     */
    updateItem: async (id: number | string, payload: any) => {
        return apiClient.patch<Item>(`/items/${id}`, payload);
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
    updateVariant: async (id: number | string, payload: any) => {
        return apiClient.patch<any>(`/item-variants/${id}`, payload);
    },

    /**
     * Alterna el estado activo/inactivo de una variante
     */
    toggleVariantStatus: async (id: number | string) => {
        return apiClient.post<any>(`/item-variants/${id}/toggle-status`);
    }
};
