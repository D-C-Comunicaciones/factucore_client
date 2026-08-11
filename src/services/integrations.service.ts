import { apiClient } from "@/lib/api-client";

// --- Tipos de API Clients ---
export interface ApiClientItem {
    id: number;
    name: string;
    api_key: string;
    is_active: boolean;
    last_used_at: string | null;
    rotated_at: string | null;
    revoked_at: string | null;
    scopes_count: number;
    created_at: string;
}

export interface ApiClientDetail extends ApiClientItem {
    scopes: { id: number; code: string; name: string }[];
}

export interface ScopeCatalogModule {
    code: string;
    name: string;
    capabilities: {
        code: string;
        name: string;
        scopes: { id: number; code: string; name: string }[];
    }[];
}

// --- Tipos de Webhooks ---
export interface WebhookEndpoint {
    id: number;
    name: string;
    url: string;
    is_active: boolean;
    created_at: string;
    subscriptions: string[];
}

export interface WebhookDelivery {
    id: number;
    webhook_endpoint_id: number;
    status: 'pending' | 'success' | 'failed' | 'exhausted';
    http_status_code: number | null;
    attempt: number;
    error_message: string | null;
    requested_at: string;
    responded_at: string | null;
    next_retry_at: string | null;
}

// El endpoint de event-types puede devolver el mapa plano {codigo: nombre}
// o venir anidado un nivel (p.ej. { event_types: {...} } o agrupado por módulo).
// Se aplana en todos los casos para garantizar un Record<string, string>.
function normalizeEventTypes(raw: Record<string, unknown> | null | undefined): Record<string, string> {
    if (!raw || typeof raw !== 'object') return {};

    const entries = Object.entries(raw);
    if (entries.every(([, value]) => typeof value === 'string')) {
        return raw as Record<string, string>;
    }

    const flat: Record<string, string> = {};
    for (const [key, value] of entries) {
        if (typeof value === 'string') {
            flat[key] = value;
        } else if (value && typeof value === 'object') {
            Object.assign(flat, normalizeEventTypes(value as Record<string, unknown>));
        }
    }
    return flat;
}

export class IntegrationsService {
    // ============================================
    // API KEYS
    // ============================================
    static async getApiClients() {
        const res = await apiClient.get<{ api_clients: ApiClientItem[] }>('/integrations/api-clients');
        return res.data?.api_clients || [];
    }

    static async getApiClient(id: number) {
        const res = await apiClient.get<{ api_client: ApiClientDetail }>(`/integrations/api-clients/${id}`);
        return res.data?.api_client;
    }

    static async createApiClient(payload: { name: string }) {
        const res = await apiClient.post<{ api_client: ApiClientItem; secret: string }>('/integrations/api-clients', payload);
        return res.data;
    }

    static async rotateApiClientSecret(id: number) {
        const res = await apiClient.post<{ secret: string }>(`/integrations/api-clients/${id}/rotate-secret`);
        return res.data?.secret;
    }

    static async revokeApiClient(id: number) {
        return apiClient.post(`/integrations/api-clients/${id}/revoke`);
    }

    static async reactivateApiClient(id: number) {
        return apiClient.post(`/integrations/api-clients/${id}/reactivate`);
    }

    static async getScopesCatalog() {
        const res = await apiClient.get<{ modules: ScopeCatalogModule[] }>('/integrations/api-clients/scopes-catalog');
        return res.data?.modules || [];
    }

    // ============================================
    // WEBHOOKS
    // ============================================
    static async getEventTypes() {
        const res = await apiClient.get<Record<string, unknown>>('/integrations/webhook-endpoints/event-types');
        return normalizeEventTypes(res.data);
    }

    static async getWebhooks() {
        const res = await apiClient.get<{ webhook_endpoints: WebhookEndpoint[] }>('/integrations/webhook-endpoints');
        return res.data?.webhook_endpoints || [];
    }

    static async getWebhook(id: number) {
        const res = await apiClient.get<{ webhook_endpoint: WebhookEndpoint }>(`/integrations/webhook-endpoints/${id}`);
        return res.data?.webhook_endpoint;
    }

    static async createWebhook(payload: { name: string; url: string; event_types?: string[] }) {
        const res = await apiClient.post<{ endpoint: WebhookEndpoint; secret: string }>('/integrations/webhook-endpoints', payload);
        return res.data;
    }

    static async getWebhookDeliveries(id: number, page: number = 1) {
        const res = await apiClient.get<any>(`/integrations/webhook-endpoints/${id}/deliveries?per_page=25&page=${page}`);
        return res.data;
    }

    static async rotateWebhookSecret(id: number) {
        const res = await apiClient.post<{ secret: string }>(`/integrations/webhook-endpoints/${id}/rotate-secret`);
        return res.data?.secret;
    }

    static async revokeWebhook(id: number) {
        return apiClient.post(`/integrations/webhook-endpoints/${id}/revoke`);
    }

    static async reactivateWebhook(id: number) {
        return apiClient.post(`/integrations/webhook-endpoints/${id}/reactivate`);
    }

    static async updateWebhookSubscriptions(id: number, event_types: string[]) {
        return apiClient.patch(`/integrations/webhook-endpoints/${id}/subscriptions`, { event_types });
    }
}
