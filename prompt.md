# Integración Frontend: Recuperación de contraseña, activación de cuenta, 2FA y perfil

Este documento describe la nueva funcionalidad de autenticación implementada en la API para que el
equipo/asistente de frontend la integre en la webapp (SPA que consume `https://.../v1/...`).

## Alcance

- Aplica **solo a cuentas webapp**: usuarios Master (equipo interno) y usuarios Tenant (empresas clientes)
  que inician sesión con `POST /auth/login`.
- **No aplica** al portal de clientes DIAN (`/portal/auth/login`) ni a los clientes API que se autentican
  con API Key + firma HMAC (`/external/*`). Esos flujos no cambian.
- Todo lo nuevo vive bajo el prefijo `/v1` (igual que el resto de la API).

## Recordatorio del modelo de auth existente (sin cambios)

- El login (`POST /auth/login`) devuelve `data.token.access_token` (Bearer) y además setea una cookie
  `access_token`. El frontend puede usar cualquiera de los dos mecanismos.
- La respuesta de login para cuentas **sin 2FA** no cambia en absoluto respecto a hoy.
- Para cuentas **con 2FA activo**, el login ahora puede devolver una respuesta distinta (ver más abajo)
  que requiere un segundo paso antes de obtener el token real.

---

## 1. Catálogo de endpoints nuevos

| Método | Ruta | Auth | Body | Respuesta (data) |
|---|---|---|---|---|
| POST | `/auth/login` | pública | `{email, password}` | Igual que hoy, **o** `{requires_2fa: true, challenge_token, expires_in}` si la cuenta tiene 2FA |
| POST | `/auth/2fa/challenge` | pública, throttled | `{challenge_token, code}` o `{challenge_token, recovery_code}` | Igual que una respuesta de login exitosa normal |
| POST | `/auth/password/forgot` | pública, throttled | `{email}` | `{message}` — siempre 200, exista o no la cuenta |
| GET | `/auth/password/validate?email=&token=` | pública | — | `{valid: bool, purpose: "password_reset"\|"tenant_activation"}` |
| POST | `/auth/password/reset` | pública, throttled | `{email, token, password, password_confirmation}` | `{message}` |
| GET | `/profile` | autenticado | — | Ver §5 |
| PUT | `/profile` | autenticado | `{name?, phone?, avatar?}` | Igual que GET `/profile` |
| PUT | `/profile/password` | autenticado | `{current_password, password, password_confirmation}` | `{message}` |
| GET | `/profile/two-factor` | autenticado | — | `{enabled, confirmed_at, pending_setup}` |
| POST | `/profile/two-factor/enable` | autenticado | — | `{secret, otpauth_uri, qr_svg}` |
| POST | `/profile/two-factor/confirm` | autenticado, throttled | `{code}` | `{recovery_codes: [10 strings]}` |
| POST | `/profile/two-factor/disable` | autenticado | `{password, code?}` | `{message}` |
| POST | `/profile/two-factor/recovery-codes/regenerate` | autenticado | `{password}` | `{recovery_codes: [...]}` |
| PATCH | `/company/profile` | autenticado, solo tenant con permiso `company.profile.edit` | ver §6 | objeto `company` actualizado |

`phone`/`avatar` en `/profile` solo aplican a cuentas tenant; en cuentas master se omiten y en su lugar
aparece `level`.

---

## 2. Flujo: activación de cuenta (tenant recién creado)

Cuando Master crea un tenant nuevo, la API **ya no** entrega una contraseña utilizable de inmediato.
En su lugar, se envía un correo al admin del tenant con un enlace de activación:

```
{FRONTEND_URL}/activate-account?email={email}&token={token}
```

Ese enlace debe llevar a una pantalla nueva **"Activar cuenta"** que:

1. Al cargar, llama a `GET /auth/password/validate?email=...&token=...` para verificar que el enlace
   siga vigente y mostrar el estado correcto (válido / expirado) antes de mostrar el formulario.
   - `purpose` en la respuesta será `"tenant_activation"`.
2. Pide una nueva contraseña (con confirmación) y llama a `POST /auth/password/reset` con
   `{email, token, password, password_confirmation}` (el mismo endpoint que "olvidé mi contraseña").
3. Si la respuesta es 200, redirige a `/login` con un mensaje de éxito ("Tu cuenta fue activada,
   inicia sesión con tu nueva contraseña").
4. Si el token expiró (respuesta 422), mostrar mensaje claro y, si aplica, un enlace para contactar
   soporte (no hay endpoint de "reenviar activación" en esta primera versión).

El enlace expira (por defecto 7 días).

---

## 3. Flujo: olvidé mi contraseña

Pantallas nuevas:

1. **Solicitar recuperación** (`/forgot-password`): un input de email → `POST /auth/password/forgot`.
   - La respuesta **siempre** es `200 {"message": "Si el correo existe, se enviará un enlace de
     recuperación."}`, exista o no la cuenta. Mostrar siempre ese mensaje genérico; no revelar si el
     email existe o no.
2. **Restablecer contraseña** (`/reset-password?email=...&token=...`): mismo patrón que activación:
   `GET /auth/password/validate` al cargar, luego `POST /auth/password/reset` con la nueva contraseña.
   - `purpose` será `"password_reset"` en este caso (la pantalla puede ser la misma para ambos
     `purpose`, ya que el body de `reset` es idéntico).

Al restablecer la contraseña exitosamente, **todas las sesiones activas del usuario se cierran**
(se revocan todos sus tokens). El usuario debe iniciar sesión de nuevo — el endpoint de reset no
devuelve un token de sesión.

Un botón "¿Olvidaste tu contraseña?" en la pantalla de login debe llevar a `/forgot-password`.

---

## 4. Flujo: login con 2FA

El `POST /auth/login` existente no cambia su firma de request. Lo que cambia es la respuesta cuando
la cuenta tiene 2FA confirmado:

```json
{
  "message": "Verificación de dos factores requerida",
  "code": 200,
  "status": "success",
  "data": {
    "requires_2fa": true,
    "challenge_token": "…64 chars…",
    "expires_in": 300
  }
}
```

El frontend debe:

1. Detectar `data.requires_2fa === true` en la respuesta de login.
2. Mostrar una pantalla/modal pidiendo el código de 6 dígitos de la app autenticadora, con un enlace
   secundario "Usar un código de recuperación" que cambia el input a texto libre.
3. Llamar a `POST /auth/2fa/challenge` con `{challenge_token, code}` o `{challenge_token,
   recovery_code}`.
4. Si es exitoso, la respuesta es **idéntica a un login exitoso normal** (mismo `account_type`,
   `user`, `token`, `company`, etc.) — tratarla exactamente igual que hoy tratas la respuesta de login.
5. Si el código es incorrecto: 422, mostrar error y permitir reintentar (máximo 5 intentos antes de
   que el `challenge_token` se invalide y haya que volver a iniciar sesión desde cero).
6. El `challenge_token` expira a los 5 minutos.

---

## 5. Vista de Perfil (nueva pantalla obligatoria)

Crear una pantalla **"Mi perfil"** accesible para cualquier usuario en sesión (master o tenant), con
estas secciones:

### 5.1 Datos personales

`GET /profile` →

```json
{
  "data": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@empresa.com",
    "phone": null,
    "avatar": null,
    "two_factor": { "enabled": false }
  }
}
```

(en cuentas master, en vez de `phone`/`avatar` aparece `level`). Formulario editable para `name` y,
si es cuenta tenant, `phone`/`avatar` → `PUT /profile`. El email no es editable desde aquí.

### 5.2 Cambiar contraseña

Formulario con `current_password`, `password`, `password_confirmation` → `PUT /profile/password`.
Al tener éxito, informar al usuario que sus otras sesiones/dispositivos fueron cerrados (la sesión
actual permanece activa).

### 5.3 Autenticación de dos pasos (2FA)

Sub-sección "Seguridad" dentro del perfil:

- Estado inicial: `GET /profile/two-factor` → mostrar "Activada" / "Desactivada".
- **Activar 2FA**:
  1. `POST /profile/two-factor/enable` → devuelve `{secret, otpauth_uri, qr_svg}`.
     - `qr_svg` es un SVG en base64: renderizar como
       `<img src="data:image/svg+xml;base64,{qr_svg}">`. No se necesita ninguna librería de QR en
       el frontend.
     - Mostrar también `secret` como texto (para ingreso manual en la app autenticadora) y/o
       `otpauth_uri` como fallback.
  2. Pedir al usuario el código de 6 dígitos que genera su app → `POST
     /profile/two-factor/confirm` con `{code}`.
  3. Si es exitoso, la respuesta trae `recovery_codes` (10 códigos). **Mostrarlos una sola vez**,
     en una pantalla que insista en guardarlos ("no podrás verlos de nuevo, solo regenerarlos").
     No hay endpoint para volver a consultarlos.
- **Desactivar 2FA**: formulario pidiendo la contraseña actual → `POST
  /profile/two-factor/disable` con `{password}`.
- **Regenerar códigos de recuperación**: pide contraseña → `POST
  /profile/two-factor/recovery-codes/regenerate`, muestra los nuevos 10 códigos una sola vez
  (invalida los anteriores).

---

## 6. Vista de configuración de empresa (solo usuarios tenant)

Los usuarios tenant con el permiso `company.profile.edit` (rol `admin` por defecto) pueden editar los
datos básicos de su propia empresa — antes esto solo lo podía hacer Master.

`PATCH /company/profile`, body (todos los campos son opcionales, se envía solo lo que cambia):

```json
{
  "company_name": "…",
  "identification_number": 900123456,
  "verification_digit": 7,
  "email": "contacto@empresa.com",
  "phone": "3001234567",
  "address": "…",
  "postal_code": "…",
  "merchant_registration": "…",
  "municipality_id": 126,
  "type_document_identification_id": 6
}
```

Este es el mismo set de campos básicos que ya se usa en la pantalla de creación/edición de tenant por
parte de Master (nombre, tipo/número de documento, correo, teléfono, dirección, etc.) — **no**
incluye plan, ambiente DIAN, tipo de organización/régimen ni responsabilidades fiscales (esos siguen
siendo exclusivos de Master). Si se envían de todos modos, la API los ignora silenciosamente.

Respuesta: `{ "company": { ...objeto tenant actualizado... } }`.

Si el usuario no tiene el permiso, la API responde `403` con
`{"details": {"required_permission": "company.profile.edit"}}`.

---

## 7. Manejo de errores / notas generales

- Todos los endpoints públicos sensibles (`/auth/password/forgot`, `/auth/password/reset`,
  `/auth/2fa/challenge`, `/profile/two-factor/confirm`) tienen rate limiting (5 intentos/minuto por
  IP+email o IP+challenge_token). Una respuesta `429` debe mostrarse como "demasiados intentos,
  espera un momento".
- Los mensajes de error de validación siguen el formato estándar de la API
  (`{"errors": {"campo": ["mensaje"]}}` con status 422).
- Ningún endpoint de esta feature revela si un email existe o no en el sistema — diseñar los mensajes
  de UI en consecuencia (mensajes genéricos, nunca "ese correo no existe").
