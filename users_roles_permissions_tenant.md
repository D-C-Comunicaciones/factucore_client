# Prompt de integración — CRUD de Usuarios, Roles y Permisos (Tenant + Master)

> Este documento es un **brief para implementar frontend**. Está escrito para pegarse
> directamente como contexto a un asistente de código del lado del cliente. Describe una API
> que **ya existe y está probada en vivo** (no es una propuesta) — todos los endpoints, cuerpos
> de ejemplo y formas de respuesta de aquí fueron verificados contra el backend real antes de
> escribir este documento.

## 0. Qué vas a construir

Una pantalla de **Usuarios**, una de **Roles** y el uso de un catálogo de **Permisos** dentro del
panel del tenant (empresa cliente), equivalente en funcionalidad a la que ya existe en el
backoffice Master — mismos verbos, mismas formas de respuesta, con dos diferencias de negocio:

1. **Tenant tiene tope de usuarios según su Plan** (Master no tiene tope).
2. **Tenant tiene un "techo" de permisos disponibles según los módulos activos de su Plan**
   (Master no tiene techo: ve el catálogo completo).

Todo lo demás — crear/editar/eliminar usuarios, crear/editar/eliminar roles, asignar
roles/permisos a un usuario, asignar permisos a un rol — es idéntico en ambos contextos.

**Regla de negocio que gobierna todo el diseño:** los **Permisos NO se crean, editan ni
eliminan desde el frontend**. El catálogo de permisos lo define el código del backend (nace de
los módulos de negocio existentes: Facturación, Inventario, Cotizaciones, etc.). Lo único que el
usuario final puede hacer con un permiso es **asignarlo o quitarlo** de un Rol o de un Usuario
puntual. No pintes un botón "Crear permiso" ni "Editar permiso" en ningún lado.

---

## 1. Autenticación y envoltorio de respuesta

Todas las rutas de este documento requieren el header `Authorization: Bearer {token}` obtenido
en el login (`POST /v1/auth/login`). El token es el mismo sin importar si el usuario es Master o
Tenant — el backend resuelve el contexto automáticamente.

**Todas las respuestas (éxito y error) pasan por un middleware que envuelve el payload.** Lo que
describen los ejemplos de este documento en `data: {...}` es lo que devuelve cada controller
puntual — en la respuesta HTTP real viene un nivel más anidado:

```jsonc
// Éxito
{
  "message": "Roles obtenidos exitosamente",
  "code": 200,
  "status": "success",
  "data": { "roles": [ /* ... */ ] }
}

// Error
{
  "message": "Se encontraron errores de validación en el formulario.",
  "code": 422,
  "status": "error",
  "errors": { "email": ["El campo email es obligatorio."] },
  "trace": null
}
```

`trace` solo trae contenido si el backend corre con `APP_DEBUG=true` — en producción siempre es
`null`. Para el frontend, el contrato estable es: **si `status === "success"`, usar `data`; si
`status === "error"`, mostrar `message` (y `errors` si viene, para marcar campos de formulario)**.

---

## 2. Endpoints

Los dos bloques son **estructuralmente idénticos**; solo cambia el prefijo de ruta y que Tenant
trae, además, el objeto `plan_limit` en el listado de usuarios.

| Acción | Tenant | Master | Permiso requerido |
|---|---|---|---|
| Listar usuarios | `GET /v1/users` | `GET /v1/master/users` | `users.view` |
| Ver usuario | `GET /v1/users/{id}` | `GET /v1/master/users/{id}` | `users.view` |
| Crear usuario | `POST /v1/users` | `POST /v1/master/users` | `users.create` |
| Editar usuario | `PATCH /v1/users/{id}` | `PATCH /v1/master/users/{id}` | `users.edit` |
| Eliminar usuario | `DELETE /v1/users/{id}` | `DELETE /v1/master/users/{id}` | `users.delete` |
| Activar/desactivar usuario | `POST /v1/users/{id}/toggle-status` | `POST /v1/master/users/{id}/toggle-status` | `users.toggle-status` |
| Asignar roles a usuario | `PATCH /v1/users/{id}/roles` | `PATCH /v1/master/users/{id}/roles` | `users.roles.assign` |
| Asignar permisos directos a usuario | `PATCH /v1/users/{id}/permissions` | `PATCH /v1/master/users/{id}/permissions` | `users.permissions.assign` |
| Restablecer contraseña (admin fija una nueva) | `PUT /v1/users/{id}/password` | `PUT /v1/master/users/{id}/password` | `users.password.reset` |
| Enviar enlace de recuperación | `POST /v1/users/{id}/password/send-reset-link` | `POST /v1/master/users/{id}/password/send-reset-link` | `users.password.send-reset-link` |
| Cambiar correo | `PATCH /v1/users/{id}/email` | `PATCH /v1/master/users/{id}/email` | `users.email.update` |
| Listar roles (para el `<select>`) | `GET /v1/roles` | `GET /v1/master/roles` | `roles.view` |
| Ver detalle de un rol | `GET /v1/roles/{id}` | `GET /v1/master/roles/{id}` | `roles.view` |
| Crear rol | `POST /v1/roles` | `POST /v1/master/roles` | `roles.create` |
| Editar rol (nombre/descripción) | `PATCH /v1/roles/{id}` | `PATCH /v1/master/roles/{id}` | `roles.edit` |
| Eliminar rol | `DELETE /v1/roles/{id}` | `DELETE /v1/master/roles/{id}` | `roles.delete` |
| Asignar permisos a rol | `PATCH /v1/roles/{id}/permissions` | `PATCH /v1/master/roles/{id}/permissions` | `roles.permissions.assign` |
| Catálogo de permisos | `GET /v1/permissions` | `GET /v1/master/permissions` | `permissions.view` |

---

## 3. Usuarios

### 3.1 Listar — `GET /v1/users`

Query params opcionales: `search` (nombre o email), `active` (`true`/`false`), `role` (nombre
exacto del rol), `per_page` (default 20).

```jsonc
// data
{
  "users": [
    {
      "id": 1,
      "name": "Administrador",
      "email": "admin@empresa.com",
      "phone": null,
      "active": true,
      "roles": ["admin"],
      "last_login_at": "18/08/2026 08:06",
      "created_at": "13/08/2026 10:24",
      "updated_at": "18/08/2026 08:06"
    }
  ],
  "pagination": { "current_page": 1, "per_page": 20, "total": 2, "last_page": 1 },
  "plan_limit": {                 // SOLO en Tenant — Master no trae esta clave
    "unlimited": true,
    "max_users": null,
    "used": 2,
    "label": "2/ilimitado"
  }
}
```

**El indicador "n/n" del listado de usuarios ya viene resuelto en `plan_limit.label`** — no
hace falta que el frontend construya el texto:

- Plan con tope: `plan_limit` = `{"unlimited": false, "max_users": 10, "used": 3, "label": "3/10"}`
- Plan ilimitado (`is_unlimited` o `has_unlimited_users` en el Plan): `{"unlimited": true, "max_users": null, "used": 3, "label": "3/ilimitado"}`

Usa `label` directamente en el UI (ej. junto al botón "+ Crear usuario"). Si necesitas un formato
distinto al texto por defecto, los campos crudos (`used`, `max_users`, `unlimited`) siguen
disponibles para componerlo tú mismo.

En Master no existe el concepto de tope — nunca vas a ver `plan_limit` en esa respuesta ni debes
mostrar ningún indicador de cupo en esa pantalla.

### 3.2 Ver detalle — `GET /v1/users/{id}`

Igual que el listado, pero además incluye los permisos calculados del usuario — útil para una
vista de "Permisos efectivos" o depuración, no necesariamente para el formulario de edición:

```jsonc
{
  "user": {
    "id": 1, "name": "Administrador", "email": "admin@empresa.com", "phone": null,
    "active": true, "roles": ["admin"],
    "last_login_at": "...", "created_at": "...", "updated_at": "...",
    "direct_permissions": ["items.delete"],           // permisos asignados DIRECTO al usuario (fuera de sus roles)
    "all_permissions": ["dashboard.view", "..."]       // unión de permisos de sus roles + directos
  }
}
```

### 3.3 Crear — `POST /v1/users`

```jsonc
// Body
{
  "name": "Juan Pérez",
  "email": "juan@empresa.com",
  "password": "opcional123",     // si se omite, se genera una aleatoria y se envía enlace de activación
  "phone": "3001234567",         // opcional, solo Tenant (Master usa "level" en su lugar, ver 3.6)
  "active": true,                // opcional, default true
  "role_ids": [4, 5],            // opcional, IDs de roles a asignar de una vez
  "send_invitation": true        // opcional: fuerza el envío del enlace de activación aunque sí mandes password
}
```

Respuesta `201` con el mismo objeto `user` de 3.1.

**Bloqueo por límite de Plan — solo Tenant.** Si el tenant ya alcanzó `max_users` de su Plan
(y no es ilimitado), el backend responde:

```jsonc
// HTTP 402
{
  "message": "No es posible crear más usuarios: el plan permite un máximo de 10.",
  "code": 402,
  "status": "error",
  "errors": null
}
```

Muestra este `message` tal cual en un toast/alerta — no lo reescribas. Deshabilita o no el botón
"+ Crear usuario" de antemano usando `plan_limit.used >= plan_limit.max_users` (y
`!plan_limit.unlimited`) para dar feedback inmediato, pero **el backend es quien decide de
verdad** — un ilimitado (`unlimited: true`) nunca debe bloquear la creación bajo ninguna
condición, sin importar cuántos usuarios ya existan.

Si el Plan del tenant no está usable (vencido/suspendido/cancelado/sin plan), la creación
también puede responder `403` con un mensaje explicando el estado del plan — igual que
cualquier otra operación de negocio del tenant.

### 3.4 Editar — `PATCH /v1/users/{id}`

```jsonc
// Body (Tenant) — todos los campos opcionales
{ "name": "Juan Pérez Actualizado", "phone": "3009999999" }
```

Para cambiar el email o la contraseña **no uses este endpoint** — son endpoints dedicados (3.8 y
3.9) porque disparan notificaciones y cierran sesiones activas.

### 3.5 Eliminar / Activar-desactivar — `DELETE` y `POST .../toggle-status`

Sin body. Ambos devuelven `409` si el usuario objetivo es el **último admin activo**:

```jsonc
// HTTP 409
{ "message": "No es posible eliminar el único usuario admin activo del tenant." }
```

(En Master el mensaje equivalente habla de "root" en vez de "admin".) Muestra este mensaje tal
cual; no permitas la acción sobre la última fila con rol admin/root activa sin que el usuario
intente y reciba este error — es la validación autoritativa.

### 3.6 Diferencia de campo: `phone` (Tenant) vs `level` (Master)

El único campo que no es 1:1 entre los dos contextos: Tenant usa `phone` (string libre); Master
usa `level` (string libre también, normalmente `root`/`admin`/`support`, pero no está atado al
sistema de roles — es solo metadata visual). Si construyes un formulario compartido entre las dos
pantallas, estos son los dos únicos inputs que cambian.

### 3.7 Asignar roles — `PATCH /v1/users/{id}/roles`

```jsonc
// Body — reemplaza TODOS los roles del usuario (no es un PATCH incremental)
{ "role_ids": [4, 5] }
```

`role_ids: []` dEja al usuario sin ningún rol. Devuelve `409` si la operación le quitaría el rol
admin/root al último admin/root activo (mismo patrón que 3.5).

### 3.8 Asignar permisos directos — `PATCH /v1/users/{id}/permissions`

```jsonc
// Body — reemplaza TODOS los permisos DIRECTOS del usuario (además de los que ya le dan sus roles)
{ "permission_ids": [12, 45, 78] }
```

**Solo en Tenant:** si algún `permission_id` no está dentro del "techo" vigente del Plan (ver
§5), la respuesta es `422`:

```jsonc
{
  "message": "Uno o más permisos no están disponibles en el Plan actual del tenant.",
  "permissions_outside_plan": ["quotations.create"]
}
```

Usa `permissions_outside_plan` para resaltar en el UI exactamente qué checkboxes causaron el
rechazo. En Master este 422 nunca ocurre (no hay techo).

### 3.9 Reset de contraseña / reenviar enlace / cambiar email

```jsonc
// PUT /v1/users/{id}/password
{ "password": "NuevaClave123" }

// POST /v1/users/{id}/password/send-reset-link
// (sin body)

// PATCH /v1/users/{id}/email
{ "email": "nuevo@correo.com" }
```

Los tres cierran las sesiones activas del usuario afectado (`resetPassword`/`updateEmail`) o no
aplica (`send-reset-link` solo envía el correo). `updateEmail` notifica por correo a la
dirección ANTERIOR por transparencia.

---

## 4. Roles

### 4.1 Listar — `GET /v1/roles`

Sin filtros. Usa esta respuesta para llenar el `<select>` de "Rol asignado" al crear/editar un
usuario:

```jsonc
{
  "roles": [
    {
      "id": 2,
      "name": "admin",
      "description": "Acceso completo a todas las secciones habilitadas por el plan de la empresa; puede administrar usuarios, roles y permisos.",
      "is_system_role": true,
      "users_count": 2,
      "permissions": ["dashboard.view", "plans.view", "..."]   // solo nombres — para el detalle completo ver 4.2
    },
    {
      "id": 4,
      "name": "facturador",
      "description": "Opera el día a día comercial: crea y edita facturas, notas crédito, cotizaciones, remisiones, órdenes de compra y pagos.",
      "is_system_role": true,
      "users_count": 0,
      "permissions": ["dashboard.view", "invoices.view", "..."]
    }
  ]
}
```

`is_system_role: true` marca los roles sembrados de fábrica (Tenant: `admin`, `facturador`,
`contador`, `lector` — Master: `root`, `admin`, `support`). **No pintes los botones
"Renombrar"/"Eliminar" sobre esas filas** — el backend los rechaza con `409` de todas formas,
pero es mejor UX no ofrecerlos. Cualquier rol nuevo que el tenant cree sí es completamente
editable/eliminable.

### 4.2 Ver detalle — `GET /v1/roles/{id}`

Esta es la vista que necesitas para pintar **"Permisos del rol X"** segmentado por sección — trae
cada permiso completo (no solo el nombre) y ya viene agrupado:

```jsonc
{
  "role": {
    "id": 2,
    "name": "admin",
    "description": "Acceso completo a todas las secciones habilitadas por el plan de la empresa; puede administrar usuarios, roles y permisos.",
    "is_system_role": true,
    "users_count": 2,
    "permissions": [
      { "id": 1, "name": "dashboard.view", "description": "Ver el panel principal con gráficas y resumen de la operación.", "module": "dashboard" },
      { "id": 78, "name": "invoices.view", "description": "Ver el listado y el detalle de las facturas.", "module": "invoices" }
      // ... lista plana completa, por si la necesitas sin agrupar
    ],
    "permissions_by_module": [
      {
        "module": "dashboard",
        "permissions": [
          { "id": 1, "name": "dashboard.view", "description": "Ver el panel principal con gráficas y resumen de la operación.", "module": "dashboard" }
        ]
      },
      {
        "module": "invoices",
        "permissions": [
          { "id": 78, "name": "invoices.view", "description": "...", "module": "invoices" },
          { "id": 79, "name": "invoices.create", "description": "...", "module": "invoices" },
          { "id": 80, "name": "invoices.edit", "description": "...", "module": "invoices" },
          { "id": 81, "name": "invoices.send-dian", "description": "...", "module": "invoices" }
        ]
      }
      // ... un bloque por cada módulo que ese rol tiene al menos un permiso
    ]
  }
}
```

**`module`** es el primer segmento del nombre técnico del permiso (`invoices.view` → `invoices`,
`users.roles.assign` → `users`) — es un identificador estable en inglés/snake_case, no un texto
para mostrar. Tú decides cómo traducirlo a un título de sección legible en la UI (ej.
`invoices` → "Facturas", `credit_notes` → "Notas de crédito", `users`/`roles`/`permissions` →
"Administración"). No existe hoy un catálogo de "nombre bonito de módulo" en el backend — si lo
necesitas, arma un diccionario estático en el frontend con los módulos reales que te devuelve la
API (ver la lista completa de permisos en el Anexo A) en vez de inventar categorías que no
existen en el sistema.

⚠️ Si tu referencia de diseño trae pestañas del estilo "Contabilidad / POS / Configuraciones
generales" con grupos como "Facturas recurrentes" — eso **no existe todavía** como conjunto de
permisos independiente en este sistema (hoy `invoices.*` cubre ver/crear/editar/enviar-DIAN sin
distinguir "recurrente" de "normal"). Construye la pantalla a partir de los `module` reales que
te devuelve la API, no de esa referencia — así el UI nunca queda desincronizado si el catálogo
de permisos cambia.

### 4.3 Crear — `POST /v1/roles`

```jsonc
// Body
{ "name": "Vendedor", "description": "Puede crear cotizaciones y ver el catálogo de productos." }
```

`description` es opcional (nullable). El rol nace **sin ningún permiso** — asígnalos después con
4.5. Respuesta `201` con el mismo formato del listado (4.1, no el detalle de 4.2).

### 4.4 Editar — `PATCH /v1/roles/{id}`

```jsonc
{ "name": "Vendedor Senior", "description": "Descripción actualizada" }
```

`name` es requerido en el PATCH (reemplaza, no es parcial); `description` es opcional. `409` si
el rol es de sistema (`is_system_role: true`).

### 4.5 Asignar permisos — `PATCH /v1/roles/{id}/permissions`

```jsonc
// Body — reemplaza TODOS los permisos del rol
{ "permission_ids": [1, 78, 79, 80] }
```

Tres casos especiales a manejar en el UI:

1. **El rol `admin` (Tenant) no se puede editar manualmente** — `409`:
   ```jsonc
   { "message": "Los permisos del rol 'admin' se administran automáticamente según el Plan del tenant y no se pueden editar manualmente." }
   ```
   Oculta el botón "Editar permisos" (o muéstralo deshabilitado con tooltip) cuando
   `role.name === 'admin'` en Tenant. En Master no aplica esta regla — `admin`/`root`/`support`
   sí se pueden re-permisar libremente.
2. **Permiso fuera del techo del Plan (solo Tenant)** — mismo `422` con
   `permissions_outside_plan` que en 3.8.
3. **Eliminar un rol con usuarios asignados** — `DELETE /v1/roles/{id}` responde `409` si
   `users_count > 0`:
   ```jsonc
   { "message": "No es posible eliminar el rol porque hay usuarios asignados a él. Reasígnalos primero." }
   ```
   Usa el `users_count` que ya trae el listado (4.1) para deshabilitar el botón "Eliminar" de
   entrada en esos roles.

---

## 5. Catálogo de permisos — `GET /v1/permissions`

```jsonc
{
  "permissions": [
    { "id": 77, "name": "acquirer.query", "description": "Consultar los datos de un cliente (adquiriente) ante la DIAN.", "module": "acquirer" },
    { "id": 78, "name": "invoices.view", "description": "Ver el listado y el detalle de las facturas.", "module": "invoices" }
    // ...
  ]
}
```

Usa este endpoint para pintar el catálogo completo de checkboxes disponibles al crear/editar
permisos de un rol o de un usuario (formulario "asignar permisos"), agrupando por `module` igual
que en §4.2 si quieres la misma UI segmentada fuera del detalle de un rol específico.

**Diferencia clave Tenant vs Master:** en **Tenant**, esta lista YA viene acotada al "techo"
vigente del Plan del tenant en sesión — nunca vas a ver, por ejemplo, `quotations.create` si el
módulo Cotizaciones no está activo en su Plan. No hace falta que el frontend filtre nada más: lo
que te devuelve este endpoint es exactamente lo asignable hoy. En **Master** esta lista es el
catálogo completo sin recorte (Master no tiene Plan ni módulos comerciales).

Esto también implica: **si cambias de tab/refrescas después de que Master le cambie el Plan a un
tenant en sesión**, la lista de permisos disponibles puede reducirse o crecer — no la cachees
agresivamente en el cliente; vuelve a pedirla cada vez que abras el formulario de asignación.

---

## 6. El límite de usuarios por Plan, en detalle (solo Tenant)

- Cada Plan define `max_users` + una bandera `has_unlimited_users` (además, `is_unlimited` a
  nivel de Plan fuerza el ilimitado sin importar `max_users`).
- El backend valida el tope **en el momento de crear un usuario** (`POST /v1/users`), nunca antes
  — el `plan_limit` del listado (§3.1) es solo informativo/UX, la fuente de verdad es la
  respuesta `402` si el intento de creación excede el tope.
- Un plan ilimitado **nunca bloquea la creación**, sin importar cuántos usuarios existan ya —
  no apliques ningún límite del lado del cliente cuando `plan_limit.unlimited === true`.
- No existe una acción explícita de "liberar cupo" — simplemente eliminar un usuario reduce el
  contador `used` de inmediato (se recalcula en vivo contando usuarios reales, no con un
  contador cacheado).

---

## 7. El usuario admin del tenant ya viene con permisos completos — no hace falta integrarlo

Cuando Master crea un tenant nuevo (`POST /tenants`, fuera del alcance de este documento), el
usuario admin semilla de ese tenant **ya nace con el rol `admin` sincronizado automáticamente al
100% de lo que su Plan permite** — esto lo hace el backend solo, antes de que el usuario reciba
el correo de activación. Lo mismo ocurre cada vez que Master le cambia el Plan al tenant o activa
un módulo nuevo: el rol `admin` se recalcula (crece o encoge) automáticamente.

**No hay ningún endpoint ni paso manual que el frontend deba llamar para esto.** Es información
para que entiendas por qué el rol `admin` de un tenant siempre aparece "completo" y por qué
`PATCH /v1/roles/{id}/permissions` lo rechaza (§4.5, caso 1) — cualquier edición manual se
perdería en el próximo recálculo automático, así que ni se ofrece la opción.

---

## 8. Checklist de integración

- [ ] Pantalla **Usuarios** (`GET /v1/users`): tabla con búsqueda (`search`), filtro por rol
      (`role`) y por estado (`active`), paginación real vía `pagination`.
- [ ] Indicador de cupo junto al botón "+ Crear usuario", usando `plan_limit.label` (Tenant) —
      ocúltalo por completo en la pantalla equivalente de Master.
- [ ] Formulario crear/editar usuario con `<select multiple>` de roles poblado desde
      `GET /v1/roles` (§4.1).
- [ ] Manejo explícito del `402` en el submit de creación (mensaje del backend tal cual, no lo
      reescribas) y del `409` de "último admin activo" en desactivar/eliminar/quitar rol admin.
- [ ] Pantalla **Roles**: listado (§4.1) con badge de `is_system_role` deshabilitando
      renombrar/eliminar, y `users_count` deshabilitando "Eliminar" cuando > 0.
- [ ] Vista **Detalle de rol** (§4.2): permisos segmentados por `module` usando
      `permissions_by_module`, cada checkbox con tooltip/ayuda desde `description`.
- [ ] Formulario "Asignar permisos" (a un rol o a un usuario) usando el catálogo de
      `GET /v1/permissions` (§5), agrupado igual por `module`.
- [ ] Deshabilitar/ocultar la edición de permisos cuando `role.name === 'admin'` en Tenant
      (§4.5, caso 1).
- [ ] Manejo del `422` con `permissions_outside_plan` al asignar permisos (Tenant) — resaltar los
      checkboxes rechazados.
- [ ] Ningún botón de crear/editar/eliminar **permiso** en ningún lado — solo asignar/quitar.

---

## Anexo A — Catálogo real de `module` por permiso (Tenant)

Lista completa de permisos vigentes del guard `tenant` agrupados por `module` (primer segmento
del nombre) — úsala para armar tu diccionario de "nombre bonito" de sección sin adivinar:

| `module` | Permisos incluidos |
|---|---|
| `dashboard` | `view` |
| `plans` | `view`, `compare`, `check-limit` |
| `audits` | `my-tenant.view` |
| `software` | `view`, `upsert` |
| `certificate` | `view`, `upsert` |
| `resolutions` | `view`, `create`, `edit`, `delete`, `toggle-status`, `query-ranges` |
| `acquirer` | `query` |
| `invoices` | `view`, `create`, `edit`, `send-dian` |
| `items` | `view`, `create`, `edit`, `toggle-status`, `delete` |
| `customers` | `view`, `create`, `edit`, `toggle-status`, `delete` |
| `sellers` | `view`, `create`, `edit`, `delete` |
| `payment_terms` | `view`, `create`, `edit`, `delete` |
| `credit_notes` | `view`, `create`, `send-dian` |
| `quotations` | `view`, `create`, `edit`, `delete` |
| `remissions` | `view`, `create`, `edit`, `delete` |
| `purchase_orders` | `view`, `create`, `edit`, `delete` |
| `payments` | `view`, `create`, `edit`, `delete` |
| `inventory` | `view`, `adjust` |
| `cost_centers` | `view`, `create`, `edit`, `delete`, `settings.view`, `settings.edit` |
| `currencies` | `view`, `create` |
| `integrations` | `view`, `create`, `edit` |
| `company` | `profile.edit` |
| `users` | `view`, `create`, `edit`, `delete`, `toggle-status`, `roles.assign`, `permissions.assign`, `password.reset`, `password.send-reset-link`, `email.update` |
| `roles` | `view`, `create`, `edit`, `delete`, `permissions.assign` |
| `permissions` | `view` |
| `comments` | `view`, `create`, `delete` |

Cuáles de estos `module` aparecen realmente en `GET /v1/permissions` para un tenant puntual
depende de sus módulos de Plan activos (ver §5) — `users`, `roles`, `permissions`, `dashboard`,
`plans`, `audits`, `software`, `certificate`, `resolutions`, `acquirer`, `company` y `comments`
están **siempre disponibles** sin importar el Plan (son autogestión básica, no una feature
comercial); el resto depende del módulo de negocio correspondiente.
