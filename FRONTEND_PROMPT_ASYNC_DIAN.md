# Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona

## Contexto

El backend de Factucore (API Laravel) cambió cómo procesa el envío de facturas y notas
crédito a la DIAN. Antes, el endpoint de envío se quedaba esperando (bloqueado) hasta
tener la respuesta final de la DIAN y la devolvía en el mismo response. Ahora el envío se
encola internamente (Redis + Horizon) y el endpoint responde de inmediato con
`HTTP 202` y el documento en estado `QUEUED`, **sin el resultado final de la DIAN**. El
procesamiento real (armar XML, firmar, enviar a la DIAN, generar/enviar el correo) ocurre
en segundo plano segundos después.

Esto se hizo para no bloquear el servidor mientras la DIAN responde (a veces tarda varios
segundos) y para poder escalar horizontalmente. **No cambia el contrato de creación sin
envío** (`POST /invoices` sigue siendo síncrono e igual que hoy) — solo cambian los
endpoints que envían a la DIAN.

## Qué se rompe con el flujo actual

Hoy, al emitir una factura o nota crédito, el frontend redirige a `invoice/{id}` (o
equivalente de nota crédito) asumiendo que la respuesta del envío ya trae el resultado
final (aceptada/rechazada, CUFE, etc.). **Eso ya no es cierto**: en el momento de la
redirección el documento puede seguir en `QUEUED` o `PROCESSING`. Si la pantalla de
detalle simplemente pinta lo que venía en la respuesta del POST, va a mostrar datos
vacíos o desactualizados.

## Qué debe hacer el frontend

1. **La redirección a `invoice/{id}` / `credit-note/{id}` se mantiene igual** — el `id`
   del documento ya viene en la respuesta del POST inmediatamente (`data.id`), no cambia.

2. **En la pantalla de detalle, revisar `dian_submission_status` antes de asumir que el
   documento ya tiene resultado final:**

   | Valor | Significado | Qué mostrar |
   |---|---|---|
   | `QUEUED` | Aún no empezó a procesarse | "Validando ante la DIAN..." (spinner/badge) |
   | `PROCESSING` | Se está armando XML/firmando/enviando | "Validando ante la DIAN..." (spinner/badge) |
   | `SENT` | Ya se envió y la DIAN respondió | Mostrar el detalle normal (CUFE, estado DIAN, etc.) |
   | `FAILED` | Falló el procesamiento interno (no es un rechazo de la DIAN, es un error técnico) | Mostrar mensaje de error y opción de reintentar/contactar soporte |

   Mientras el estado es `QUEUED` o `PROCESSING`, los demás campos del documento
   (CUFE, estado DIAN, XML/PDF) pueden no existir todavía — no renderizar esas secciones
   hasta que el estado sea `SENT`.

3. **Hacer polling a `GET /api/v1/invoices/{id}` (o `GET /api/v1/credit-notes/{id}`)**
   cada ~3 segundos mientras `dian_submission_status` esté en `QUEUED` o `PROCESSING`.
   Detener el polling en cuanto cambie a `SENT` o `FAILED`.

   - Recomendado: un timeout de UI de ~60-90 segundos. Si sigue en `QUEUED`/`PROCESSING`
     después de ese tiempo, dejar de hacer polling activo y mostrar algo como "Esto está
     tardando más de lo normal, puedes seguir navegando y revisar el estado más tarde" en
     vez de spinear indefinidamente. El documento se sigue procesando en el servidor
     igual — el usuario puede volver a entrar a la misma pantalla después y el polling se
     retoma normal.

   - Una vez `SENT`, el campo `dian_status_id` (dentro del documento) trae el resultado de
     negocio real de la DIAN:
     - `1` = No electrónica (no aplica / pendiente, caso poco común post-envío)
     - `2` = Aprobada
     - `3` = No aprobada (rechazada por la DIAN — esto es un resultado válido, no un error
       técnico; mostrarlo como tal, no como fallo)

4. **Aplica igual a facturas y notas crédito**, mismos endpoints de envío:
   - `POST /api/v1/invoices/send` (crear + enviar)
   - `POST /api/v1/invoices/{id}/send` (reenviar factura existente)
   - `POST /api/v1/credit-notes/send` (crear + enviar nota crédito)

   Y mismos endpoints de consulta para el polling:
   - `GET /api/v1/invoices/{id}`
   - `GET /api/v1/credit-notes/{id}`

5. **Mensajes al usuario**: el backend ya devuelve mensajes más claros en el `message` de
   la respuesta del POST (ya no dice "encolado", dice algo como "Factura creada. Estamos
   validándola ante la DIAN."). Si el frontend ya muestra ese `message` tal cual (toast,
   etc.), no requiere cambios de copy — solo revisar que no haya textos hardcodeados en el
   frontend que asuman que el resultado final ya está disponible justo después del POST.

## Qué NO cambia

- `POST /invoices` (guardar borrador sin enviar a la DIAN) — sigue igual, síncrono.
- La forma general de la respuesta (`message`, `code`, `status`, `data`) — igual, solo que
  ahora `data.dian_submission_status` siempre viene en `QUEUED` justo después del POST, y
  `dian` viene `null` en esa respuesta inmediata (antes podía traer el resultado final).
- Descargas de XML/PDF/ZIP y demás endpoints — sin cambios.

## Ejemplo de polling (pseudocódigo, adaptar al stack del frontend)

```js
async function pollInvoiceUntilResolved(invoiceId, { intervalMs = 3000, timeoutMs = 90000 } = {}) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const { invoice } = await fetchInvoice(invoiceId); // GET /api/v1/invoices/{id}

    if (invoice.dian_submission_status === 'SENT' || invoice.dian_submission_status === 'FAILED') {
      return invoice; // listo, pintar resultado final
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return null; // se acabó el timeout de UI, seguir procesándose en el servidor
}
```
