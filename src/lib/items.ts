import { apiClient } from "@/lib/api-client";
import {
    ItemResponse,
    CreateItemPayload,
    UpdateItemPayload,
    UpdateVariantPayload,
    ItemListResponse,
    GetItemByIdResponse,
    ItemsListApiData
} from "@/types/items";
import { PaginatedData } from "@/types/api";

export const itemsApi = {
    /**
     * Obtiene la lista de ítems paginada
     */
    getItems: async (
        params?: Record<string, any>
    ): Promise<PaginatedData<ItemListResponse> & { summary: ItemsListApiData["summary"] }> => {
        const response =
            await apiClient.get<
                ItemsListApiData
            >("/items", {
                params,
            });

        const { items, pagination, summary } = response.data;

        return {
            data: items,
            total: pagination.total,
            per_page: pagination.per_page,
            current_page: pagination.current_page,
            last_page: pagination.last_page,
            message: response.message,
            summary,
        };
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
     * Alterna el estado de uno o varios ítems.
     * Acepta un ID, un arreglo de IDs o un arreglo de objetos { id, is_active }.
     */
    toggleItemStatus: async (
        ids: number | string | (number | string)[],
        isActive?: boolean
    ) => {
        const idsArray = Array.isArray(ids) ? ids : [ids];
        const payload: Record<string, any> = { ids: idsArray };
        if (isActive !== undefined) payload.is_active = isActive;
        return apiClient.post<any>("/items/toggle-status", payload);
    },

    /**
     * Alterna el estado de una o varias variantes.
     */
    toggleVariantStatus: async (
        ids: number | string | (number | string)[],
        isActive?: boolean
    ) => {
        const idsArray = Array.isArray(ids) ? ids : [ids];
        const payload: Record<string, any> = { ids: idsArray };
        if (isActive !== undefined) payload.is_active = isActive;
        return apiClient.post<any>("/item-variants/toggle-status", payload);
    },

    /**
     * Detecta si el registro es ítem o variante y llama al endpoint correcto.
     * entityType: "item" | "variant"
     */
    toggleEntityStatus: async (
        entityType: "item" | "variant",
        ids: number | string | (number | string)[],
        isActive?: boolean
    ) => {
        const idsArray = Array.isArray(ids) ? ids : [ids];
        const payload: Record<string, any> = { ids: idsArray };
        if (isActive !== undefined) payload.is_active = isActive;
        const url = entityType === "variant"
            ? "/item-variants/toggle-status"
            : "/items/toggle-status";
        return apiClient.post<any>(url, payload);
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
    }
};
