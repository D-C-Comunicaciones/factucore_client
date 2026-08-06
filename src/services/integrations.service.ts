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

export class IntegrationsService {
    // ============================================
    // API KEYS
    // ============================================
    static async getApiClients() {
        const res = await apiClient.get<{ api_clients: ApiClientItem[] }>('/v1/integrations/api-clients');
        return res.data?.api_clients || [];
    }

    static async getApiClient(id: number) {
        const res = await apiClient.get<{ api_client: ApiClientDetail }>(`/v1/integrations/api-clients/${id}`);
        return res.data?.api_client;
    }

    static async createApiClient(payload: { name: string; scope_ids?: number[] }) {
        const res = await apiClient.post<{ api_client: ApiClientItem; secret: string }>('/v1/integrations/api-clients', payload);
        return res.data;
    }

    static async rotateApiClientSecret(id: number) {
        const res = await apiClient.post<{ secret: string }>(`/v1/integrations/api-clients/${id}/rotate-secret`);
        return res.data?.secret;
    }

    static async revokeApiClient(id: number) {
        return apiClient.post(`/v1/integrations/api-clients/${id}/revoke`);
    }

    static async reactivateApiClient(id: number) {
        return apiClient.post(`/v1/integrations/api-clients/${id}/reactivate`);
    }

    static async updateApiClientScopes(id: number, scope_ids: number[]) {
        return apiClient.patch(`/v1/integrations/api-clients/${id}/scopes`, { scope_ids });
    }

    static async getScopesCatalog() {
        const res = await apiClient.get<{ modules: ScopeCatalogModule[] }>('/v1/integrations/api-clients/scopes-catalog');
        return res.data?.modules || [];
    }

    // ============================================
    // WEBHOOKS
    // ============================================
    static async getEventTypes() {
        const res = await apiClient.get<Record<string, string>>('/v1/integrations/webhook-endpoints/event-types');
        return res.data || {};
    }

    static async getWebhooks() {
        const res = await apiClient.get<{ webhook_endpoints: WebhookEndpoint[] }>('/v1/integrations/webhook-endpoints');
        return res.data?.webhook_endpoints || [];
    }

    static async getWebhook(id: number) {
        const res = await apiClient.get<{ webhook_endpoint: WebhookEndpoint }>(`/v1/integrations/webhook-endpoints/${id}`);
        return res.data?.webhook_endpoint;
    }

    static async createWebhook(payload: { name: string; url: string; event_types?: string[] }) {
        const res = await apiClient.post<{ endpoint: WebhookEndpoint; secret: string }>('/v1/integrations/webhook-endpoints', payload);
        return res.data;
    }

    static async getWebhookDeliveries(id: number, page: number = 1) {
        const res = await apiClient.get<any>(`/v1/integrations/webhook-endpoints/${id}/deliveries?per_page=25&page=${page}`);
        return res.data;
    }

    static async rotateWebhookSecret(id: number) {
        const res = await apiClient.post<{ secret: string }>(`/v1/integrations/webhook-endpoints/${id}/rotate-secret`);
        return res.data?.secret;
    }

    static async revokeWebhook(id: number) {
        return apiClient.post(`/v1/integrations/webhook-endpoints/${id}/revoke`);
    }

    static async reactivateWebhook(id: number) {
        return apiClient.post(`/v1/integrations/webhook-endpoints/${id}/reactivate`);
    }

    static async updateWebhookSubscriptions(id: number, event_types: string[]) {
        return apiClient.patch(`/v1/integrations/webhook-endpoints/${id}/subscriptions`, { event_types });
    }
}
