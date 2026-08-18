# Comentarios con @mentions + Notificaciones en tiempo real

## ⚠️ Transporte de notificaciones: WebSockets reales (Laravel Reverb) — SÍ hay que instalar algo

Pregunta directa que se va a hacer el frontend: **¿qué tecnología usa esto,
sockets, Pusher, alguna librería?** Respuesta: **WebSockets de verdad, vía
[Laravel Reverb](https://laravel.com/docs/reverb)** — servidor propio,
self-hosted (no es Pusher como servicio externo, aunque habla el mismo
protocolo por compatibilidad). Se eligió Reverb sobre Pusher a propósito
para no depender de un tercero ni pagar por mensaje/conexión.

**Ya NO es polling** — cada usuario abre una conexión WebSocket persistente
y el evento le llega apenas se lo menciona, sin pegarle a la API cada
30s. Los endpoints REST (`GET /v1/notifications`, `/unread-count`, `PATCH
.../read`) se mantienen para carga inicial del panel y como respaldo si el
socket se cae — dejan de ser el mecanismo principal.

**Sí hay que instalar algo en el frontend**:
```bash
npm install laravel-echo pusher-js
```
(`pusher-js` es el cliente WebSocket que Echo usa por dentro — Reverb habla
el mismo protocolo, no significa que estés usando el servicio de Pusher).

**Infraestructura nueva**: un tercer servicio en Railway,
`factucore_websockets` (mismo Dockerfile, rol distinto), que corre el
servidor Reverb. A diferencia de `factucore_workers`, este SÍ necesita
dominio público (el navegador se conecta directo por WSS).

## Arquitectura

**Comentarios** son polimórficos (`commentable_type`/`commentable_id`) y centralizados: cualquier módulo se suma agregando una línea a `Comment::commentableTypeMap()` (`app/Models/Comment.php`). Hoy están habilitados: `invoice`, `credit_note`, `quotation`, `remission`. La API nunca recibe un nombre de clase PHP crudo del cliente — solo estos alias cortos, por seguridad.

**Regla de guardado**: solo se puede comentar un documento que ya fue guardado. Esto se resuelve con la interfaz `App\Contracts\Commentable` (`commentsAreAllowed(): bool`) — hoy solo `Invoice` la implementa (bloquea si `invoice_status_id === BORRADOR`). Los demás tipos no la implementan y se consideran siempre comentables. Para agregar el mismo tipo de bloqueo a otro módulo en el futuro, basta con implementar la interfaz en su modelo.

**Mentions**: el modelo `User` no tiene `username`, así que no se parsea `@Nombre` con regex — el frontend resuelve el picker `@` contra un endpoint de búsqueda y manda **IDs concretos** (`mentions: [45, 12]`) junto al texto libre del comentario (que puede seguir mostrando `@Nombre` como texto, es solo cosmético).

**Notificaciones**: se usa el sistema nativo de Laravel (`Illuminate\Notifications`), con DOS canales a la vez — `database` (persiste en la tabla `notifications`, para historial/carga inicial del panel) y `broadcast` (push instantáneo vía Reverb). Al mencionar a alguien se dispara `App\Notifications\UserMentionedInComment`, que va por la cola `notifications` de RabbitMQ (igual que el resto de la app — el broadcast se dispara desde `factucore_workers`, no desde el request HTTP) y termina: (a) como fila en `notifications`, y (b) como evento push en el canal privado del usuario mencionado. **No se envía correo** — es in-app en ambos sentidos (persistente + instantáneo).

**Multi-tenancy en el canal**: el id de usuario NO es único entre tenants (tenant A y B pueden tener ambos un usuario id=1) — el canal privado incluye el tenant a propósito: `tenant.{tenantId}.users.{userId}` (ver `App\Models\Tenant\User::receivesBroadcastNotificationsOn()` y `routes/channels.php`, que valida ambos).

**Transporte**: WebSockets reales vía Reverb — ver el aviso al principio de este documento y la sección "WebSockets" más abajo para el detalle completo de instalación y el snippet de conexión.

## API — Comentarios

### `GET /v1/comments?type=invoice&commentable_id=123&per_page=20`
Requiere `permission:comments.view`.

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "commentable_type": "App\\Models\\Invoice",
      "commentable_id": 123,
      "comment": "Hola @Juan revisa esto",
      "is_internal": false,
      "created_at": "2026-08-17T16:37:11-05:00",
      "user": { "id": 1, "name": "Administrador", "email": "admin@..." },
      "mentions": [ { "id": 45, "name": "Juan Pérez", "email": "juan@..." } ]
    }
  ],
  "per_page": 20,
  "total": 1
}
```

### `POST /v1/comments`
Requiere `permission:comments.create`.

Body:
```json
{
  "type": "invoice",
  "commentable_id": 123,
  "comment": "Hola @Juan revisa esto",
  "is_internal": false,
  "mentions": [45]
}
```

- `type`: uno de `invoice`, `credit_note`, `quotation`, `remission`.
- `mentions`: array de IDs de usuario del tenant (obtenidos vía el endpoint de búsqueda de abajo). IDs inválidos/de otro tenant se ignoran silenciosamente, no rompen la request. No hace falta incluirse a uno mismo aunque se autoescriba `@MiNombre` — el backend excluye al autor de las notificaciones.

Respuestas:
- `201` — comentario creado, mismo shape que el `data[i]` de arriba.
- `422` — `{"message": "No se puede comentar un documento en borrador. Guárdelo primero."}` (factura en `BORRADOR`) o `{"message": "..."}` de validación estándar.
- `404` implícito como `422` con `{"message": "El documento a comentar no existe."}` si el `commentable_id` no existe.

### `DELETE /v1/comments/{id}`
Requiere `permission:comments.delete`. `204` sin body.

### `GET /v1/comments/mentionable-users?search=jua`
Requiere `permission:comments.create` (no `users.view` — deliberado, para que cualquiera que pueda comentar pueda mencionar, sin necesitar el permiso de administración de usuarios).

```json
{ "data": [ { "id": 45, "name": "Juan Pérez", "email": "juan@..." } ] }
```

Sin `search` devuelve los primeros usuarios activos del tenant (máx. 20). Con `search`, filtra por nombre o email (`ilike`).

## API — Notificaciones

Todas requieren estar autenticado como usuario tenant; no hay permiso adicional — cada quien solo ve/marca las suyas.

### `GET /v1/notifications?filter=unread|read|all&per_page=20`

```json
{
  "current_page": 1,
  "data": [
    {
      "id": "9e1f2a3b-...-uuid",
      "type": "App\\Notifications\\UserMentionedInComment",
      "data": {
        "type": "comment_mention",
        "comment_id": 1,
        "commentable_type": "invoice",
        "commentable_id": 123,
        "commentable_label": "SETP 990003113",
        "excerpt": "Hola @Juan revisa esto",
        "mentioned_by": { "id": 1, "name": "Administrador" },
        "created_at": "2026-08-17T16:37:11-05:00"
      },
      "read_at": null,
      "created_at": "2026-08-17T16:37:11-05:00"
    }
  ]
}
```

### `GET /v1/notifications/unread-count`
```json
{ "count": 3 }
```

### `PATCH /v1/notifications/{id}/read`
Marca una como leída. `404` si el ID no le pertenece al usuario autenticado (nunca se puede marcar la notificación de otro).

### `PATCH /v1/notifications/read-all`
Marca todas las pendientes del usuario actual como leídas.

## WebSockets — conexión y suscripción

### Instalar y configurar Echo

```bash
npm install laravel-echo pusher-js
```

```js
// echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,       // mismo REVERB_APP_KEY del backend (es público, va en el cliente)
  wsHost: import.meta.env.VITE_REVERB_HOST,        // dominio PÚBLICO de factucore_websockets (Railway)
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],

  // Esta API NO usa cookies de sesión Sanctum SPA — usa Bearer token, así
  // que Echo necesita un authorizer a medida que mande el Authorization
  // header al pegarle a /v1/broadcasting/auth (si no, la suscripción al
  // canal privado siempre va a fallar con 401).
  authorizer: (channel) => ({
    authorize: (socketId, callback) => {
      fetch(`${import.meta.env.VITE_API_URL}/v1/broadcasting/auth`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getStoredAccessToken()}`, // el mismo token que ya usan para el resto de la API
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ socket_id: socketId, channel_name: channel.name }),
      })
        .then((res) => res.json())
        .then((data) => callback(false, data))
        .catch((error) => callback(true, error));
    },
  }),
});
```

Variables de entorno del **frontend** (distintas de las del backend — estas
apuntan al dominio PÚBLICO):
```
VITE_REVERB_APP_KEY=<mismo REVERB_APP_KEY que factucore_api/workers/websockets>
VITE_REVERB_HOST=<dominio público de factucore_websockets en Railway>
```

### Suscribirse al canal propio

```js
import { echo } from './echo';

const tenantId = getCurrentTenantId(); // el id del tenant actual
const userId = getCurrentUserId();     // el id del usuario logueado

const channel = echo.private(`tenant.${tenantId}.users.${userId}`)
  .notification((notification) => {
    // notification === el mismo payload que ya trae GET /v1/notifications
    // (type, comment_id, commentable_type, commentable_id,
    // commentable_label, excerpt, mentioned_by, created_at)
    incrementBadgeCount();          // actualizar el badge SIN pegarle a la API
    showToast(notification);        // opcional: notificación visual tipo "toast"
  });

// al cerrar sesión / desmontar:
echo.leave(`tenant.${tenantId}.users.${userId}`);
```

## Qué implementar en el frontend

### Campanita del navbar/header

1. **Al cargar la app**: llamar `GET /v1/notifications/unread-count` una vez para el número inicial del badge, y suscribirse al canal privado (arriba) para lo que llegue después — ya no hace falta pollear en un intervalo.
2. **Cuando llega un evento por el socket** (`.notification(...)`): incrementar el badge directamente desde el payload del evento (no hace falta volver a pedir `unread-count`), y opcionalmente mostrar un toast/sonido.
3. **Al hacer clic en la campanita**: abrir un dropdown/panel que llame `GET /v1/notifications?filter=unread&per_page=10` (o `all` si querés mostrar también las leídas con otro estilo). Por cada item, usar `data.excerpt`, `data.mentioned_by.name` y `data.commentable_label` para armar el texto (ej. *"Administrador te mencionó en SETP 990003113"*), y `data.commentable_type` + `data.commentable_id` para armar el link de navegación al documento correspondiente (ej. `/invoices/123` si `commentable_type === "invoice"`).
4. **Al abrir/leer una notificación** (click en el item, o al abrir el panel — como prefieran UX): llamar `PATCH /v1/notifications/{id}/read`, y restar 1 del contador local.
5. **Botón "marcar todo como leído"**: `PATCH /v1/notifications/read-all`.
6. **Respaldo si el socket se cae**: si Echo detecta desconexión (`echo.connector.pusher.connection.bind('state_change', ...)`), es razonable caer a polling de `unread-count` cada 30-60s SOLO mientras el socket esté caído, y dejar de pollear en cuanto reconecte — así casi nunca se pollea, pero tampoco se queda ciego si el WebSocket falla.

### Picker `@` en el campo de comentarios

1. Al detectar que el usuario escribe `@` seguido de texto en el textarea de comentario, disparar `GET /v1/comments/mentionable-users?search=<lo que escribió después de @>` (debounce ~300ms).
2. Mostrar un dropdown con los resultados (`name`, opcionalmente `email` como subtítulo).
3. Al seleccionar un usuario del dropdown: insertar `@NombreVisible` como texto en el textarea (cosmético) **y** guardar su `id` en un array local de "menciones pendientes" del formulario.
4. Al enviar el comentario (`POST /v1/comments`), mandar ese array como `mentions: [...]` junto al `comment` de texto libre.
5. Si el usuario borra el `@NombreVisible` del texto manualmente, hay que sacar también su ID del array de menciones antes de enviar (si no, quedaría mencionado sin aparecer en el texto — decisión de UX, pero es lo más consistente).

### Mostrar comentarios existentes

Al listar comentarios (`GET /v1/comments?type=...&commentable_id=...`), cada uno trae `mentions` ya resuelto (array de `{id, name, email}`) — se puede usar para, por ejemplo, resaltar `@Nombre` dentro del texto del comentario si se quiere un estilo tipo Slack/GitHub (buscar el nombre en el texto y envolverlo en un `<span>` con estilo), aunque no es obligatorio — mostrar el texto plano también es válido.

## Permisos

`comments.view` / `comments.create` / `comments.delete` (agregados a `TenantRoleSeeder`). Perfil por rol: `admin` y `facturador` tienen los tres; `contador` y `lector` solo `comments.view`. Ajustar en `database/seeders/TenantRoleSeeder.php` si algún rol necesita otro perfil.

## Migraciones a correr

```bash
php artisan tenants:migrate       # crea comment_mentions y notifications en cada tenant
php artisan tenants:seed --class="Database\Seeders\TenantRoleSeeder"   # registra los permisos comments.*
```

## Despliegue en Railway — servicio nuevo `factucore_websockets`

1. Crear el servicio (misma imagen/Dockerfile que `factucore_api`/`factucore_workers`).
2. Start Command: `php artisan reverb:start --host=0.0.0.0 --port=$PORT`.
3. Variables: ver `.env.websockets` (gitignored, generado con `REVERB_APP_ID/KEY/SECRET` — deben ser **idénticos** en `factucore_api`, `factucore_workers` y `factucore_websockets`, son el secreto compartido que firma la autenticación de canales).
4. **A diferencia de `factucore_workers`, este servicio necesita dominio público** (Settings → Networking → Generate Domain) — el navegador se conecta directo por WSS. `factucore_api`/`factucore_workers` en cambio usan la red PRIVADA de Railway para publicar eventos (`REVERB_HOST=${{factucore_websockets.RAILWAY_PRIVATE_DOMAIN}}`, ya cargado en `.env.deploy`/`.env.workers`).
5. Healthcheck: de proceso, no HTTP (no hay un `/up` en Reverb) — o dejar sin healthcheck si Railway no soporta healthcheck de proceso para este tipo de servicio.
6. Cargar en el frontend `VITE_REVERB_APP_KEY` (mismo `REVERB_APP_KEY`) y `VITE_REVERB_HOST` (el dominio PÚBLICO que Railway le asigne a `factucore_websockets`).
