# Prompt para el frontend principal (app de los tenants: facturación, ítems, clientes, y ahora integraciones)

Copia este documento completo como instrucción inicial en la sesión de Claude Code que trabaje sobre el repositorio de la app principal (donde los usuarios WEB_APP inician sesión, facturan, gestionan ítems/clientes/etc.). El backend ya está implementado y probado end-to-end. **Este prompt cubre exclusivamente lo recién implementado: menú dinámico + autoservicio de API Keys y Webhooks.** Certificados, software, resoluciones y todo lo demás ya existen en esta app — no los toques ni los describas de nuevo, no son parte de este trabajo.

Formato de respuesta estándar del backend: `{ message?, code, status, data: {...} }` (login/me) o `{ customMessage?, ...datos }` (el resto). Todas las rutas van bajo `/v1` con la sesión Sanctum normal del tenant.

---

## Parte 1 — Menú dinámico (prioridad alta, afecta a toda la app)

El login (`POST /v1/auth/login` con credenciales de tenant) y `GET /v1/me` ahora devuelven, junto a lo que ya devolvían (`roles`, `permissions`, `company`/`user`):

```json
{
  "data": {
    "account_type": "tenant",
    "tenant_id": "...",
    "channels": ["WEB_APP", "API"],
    "modules": ["billing", "credit_notes", "contacts", "items", "inventory", "resolutions", "certificates", "software", "webhooks"],
    "scopes": ["billing.invoice.create", "billing.invoice.read", "..."],
    "features": ["excel_export", "items_combo_management"],
    "features_override": [
      { "feature_code": "items_combo_management", "feature_name": "Gestión de combos", "is_enabled": false, "reason": "Downgrade temporal acordado con el cliente" }
    ],
    "user": { "id": 1, "name": "...", "email": "...", "roles": [...], "permissions": [...] }
  }
}
```

**Qué es cada campo y cómo usarlo:**

- **`channels`**: casi nunca relevante en la UI (si `WEB_APP` no estuviera activo, el login ya se habría rechazado con 403 antes de llegar aquí) — inclúyelo en el store por completitud, sin lógica especial.
- **`modules`**: códigos de los módulos que el TENANT tiene habilitados (esto lo controla Master, no depende del usuario). **Regla de armado del menú**:
  ```
  mostrar item de menú del módulo X  ⟺  X está en modules  Y  el usuario tiene el permiso Spatie correspondiente (roles/permissions, como ya se hacía)
  ```
  Si `items` no está en `modules`, oculta TODO lo de Ítems para TODOS los usuarios del tenant, sin importar sus permisos individuales — es una restricción a nivel de tenant, no de usuario.
- **`scopes`**: catálogo de acciones disponibles bajo los módulos activos del tenant (informativo — no hay "scopes por usuario", solo por tenant). Útil si quieres mostrar, en la pantalla de autoservicio de API Clients (Parte 2), qué scopes existen para ofrecer al crear/editar uno — pero para eso ya existe un endpoint dedicado más cómodo (ver Parte 2.2), no hace falta derivarlo de aquí.
- **`features`**: funcionalidades puntuales activas. Úsalo para mostrar/ocultar botones específicos dentro de un módulo ya visible — ej. si `excel_export` no está, oculta el botón "Exportar" en Cotizaciones/Remisiones aunque el módulo de facturación sí esté activo.
- **`features_override`**: informativo — si quieres mostrarle al usuario tenant "por qué" no tiene cierta feature (ej. un tooltip "Esta función no está incluida en tu plan actual"), aquí viene el detalle. No es obligatorio usarlo en el MVP.

Guarda esta respuesta en el store global de sesión (junto a roles/permisos) y recalcula el menú en cada login y cada refresh de `/me`.

---

## Parte 2 — Autoservicio de Integraciones (NUEVO módulo en el menú, sujeto a permiso `integrations.view`)

Agrega una sección "Integraciones" (o dentro de "Configuración") con dos pestañas: **API Keys** y **Webhooks**. Visible solo si el usuario tiene el permiso `integrations.view` (viene en `permissions`, igual que cualquier otro permiso ya usado en esta app) — no depende de ningún módulo en particular, es transversal.

**Importante**: en estos endpoints el tenant NUNCA se envía en el payload — el backend siempre usa el tenant de la sesión autenticada. Un usuario tenant solo puede ver/administrar los API Clients y Webhooks de su propio tenant.

### 2.1 Pestaña "API Keys"

- **Listar**: `GET /v1/integrations/api-clients` → `{ api_clients: [{ id, name, api_key, is_active, last_used_at, rotated_at, revoked_at, scopes_count, created_at }] }`. El `secret` nunca viene aquí.
- **Crear**: `POST /v1/integrations/api-clients` con `{ name, scope_ids?: number[] }` → `201` con `{ api_client, secret }`. **El `secret` solo se muestra en este momento y al rotar — nunca más se puede recuperar.** Modal con botón "copiar" + aviso claro tipo "Guarda este secreto ahora, no volverá a mostrarse" antes de cerrar. Explica también, en el mismo modal o en ayuda contextual, que la integración deberá firmar sus peticiones con este `api_key`/`secret` vía HMAC-SHA256 (headers `X-API-Key`, `X-Timestamp`, `X-Nonce`, `X-Signature`) — es información para que el usuario se la pase a quien vaya a configurar la integración (SAP, ERP, etc.), no algo que la UI tenga que implementar.
- **Detalle**: `GET /v1/integrations/api-clients/{id}` → incluye `scopes: [{id, code, name}]`.
- **Rotar secreto**: `POST /v1/integrations/api-clients/{id}/rotate-secret` → `{ secret }` (mismo patrón "una sola vez").
- **Revocar / Reactivar**: `POST /v1/integrations/api-clients/{id}/revoke` y `.../reactivate`.
- **Editar scopes**: `PATCH /v1/integrations/api-clients/{id}/scopes` con `{ scope_ids: number[] }` (reemplaza la lista completa; `[]` los quita todos).

#### Catálogo de Scopes (selector de checkboxes al crear/editar)

`GET /v1/integrations/api-clients/scopes-catalog` → 
```json
{ "modules": [
  { "code": "billing", "name": "Facturación", "capabilities": [
    { "code": "invoice", "name": "Facturas", "scopes": [
      { "id": 1, "code": "billing.invoice.create", "name": "Crear facturas" },
      { "id": 2, "code": "billing.invoice.read", "name": "Consultar facturas" }
    ]}
  ]}
]}
```
Este catálogo trae **todos** los módulos del sistema, no solo los que el tenant tiene activos — filtra en frontend contra `modules` (Parte 1) si quieres mostrar solo los scopes de módulos que el tenant realmente tiene habilitados. Renderiza un árbol/acordeón Módulo → Capability → Scopes con checkboxes.

### 2.2 Pestaña "Webhooks"

- **Tipos de evento disponibles**: `GET /v1/integrations/webhook-endpoints/event-types` → objeto `{codigo: nombre_legible}`. Eventos de facturas (creada, firmada, enviada a la DIAN, aceptada, rechazada, correo enviado, correo fallido) y los mismos 7 para notas crédito.
- **Listar**: `GET /v1/integrations/webhook-endpoints` → cada uno con sus `subscriptions` (a qué eventos está suscrito).
- **Crear**: `POST /v1/integrations/webhook-endpoints` con `{ name, url (debe ser https://), event_types?: string[] }` → `201` con el endpoint + `secret` (mismo patrón "una sola vez" — este es el secreto para validar la firma HMAC que el backend pone en cada webhook entregado, distinto del secreto del API Key).
- **Detalle**: `GET /v1/integrations/webhook-endpoints/{id}`.
- **Historial de entregas**: `GET /v1/integrations/webhook-endpoints/{id}/deliveries?per_page=25` → paginado, con `status` (`pending`/`success`/`failed`/`exhausted`), `http_status_code`, `attempt`, `error_message`, `requested_at`, `responded_at`, `next_retry_at`. Pantalla de "logs" con reintentos visibles — útil para que el usuario diagnostique por qué no le está llegando un webhook.
- **Rotar secreto / Revocar / Reactivar**: mismos verbos que API Keys.
- **Editar suscripciones**: `PATCH /v1/integrations/webhook-endpoints/{id}/subscriptions` con `{ event_types: string[] }` (reemplaza completo).

---

## Notas generales

- Nada de esto usa firma HMAC desde el navegador — todas estas pantallas son peticiones normales autenticadas con la sesión Sanctum de siempre, como el resto de la app. La HMAC es algo que la integración externa (el software del cliente) tiene que implementar por su cuenta, usando las credenciales que esta UI le entrega.
- El patrón "secreto mostrado una sola vez" es intencional y de seguridad — no lo hagas recuperable ni lo pidas al backend.
- Certificados, Software y Resoluciones de autoservicio ya existen en esta app — no son parte de este prompt.
