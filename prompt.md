# Documentación de Endpoints de Facturación

Esta guía detalla los endpoints principales de facturación y explica cómo el Frontend debe enviar las distintas acciones de guardado (`save_action`) de acuerdo a las opciones de interfaz mostradas.

---

## Mapeo de Acciones del Frontend

De acuerdo a las opciones que muestras en la interfaz de usuario, este es el valor exacto que debes enviar en la propiedad `save_action` dentro del cuerpo de la petición (JSON payload):

| Opción en Interfaz | Valor de `save_action` | Descripción del comportamiento en Backend |
| --- | --- | --- |
| **Vista Previa** | *Usar Preflight* | Usa el endpoint de `preflight`. Este no guarda la factura en la BD, simplemente hace los cálculos en memoria y te devuelve un archivo PDF en el acto. |
| **Guardar como borrador** | `"DRAFT"` | La factura se guarda con estado interno `DRAFT`. **No se exige** tener una resolución (`numbering_range_id`) ni se consume numeración. Queda disponible para edición futura. |
| **Guardar y crear nueva** | `"SAVED"` | La factura toma numeración real (consume resolución) y queda en estado `SAVED` (Guardada). Queda preparada pero aún NO se transmite a la DIAN. |
| **Guardar e imprimir** | `"PRINT"` | Se comporta igual que `SAVED` (toma numeración) y el frontend debe descargar o abrir el PDF una vez el backend devuelva la respuesta exitosa. |
| **Guardar y enviar por correo** | `"EMAIL"` | Toma numeración (`SAVED`), genera el documento en PDF y el backend lo envía directamente por correo al cliente. No se transmite a la DIAN. |
| **Guardar y Emitir** | `"EMIT"` | Toma numeración, pasa a estado `SENT` o `PENDING`, se firma el XML y se emite de inmediato ante la DIAN. |

---

## 1. Vista Previa (Preflight) (`POST /v1/invoices/preflight`)

Utilizado cuando el usuario hace clic en **"Vista Previa"**. Envía el mismo payload que usarías para crear la factura. El backend procesará los cálculos y renderizará el documento internamente revirtiendo los cambios, **devolviendo directamente el archivo PDF**.

### Petición

```http
POST /v1/invoices/preflight
Content-Type: application/json
Authorization: Bearer <TU_TOKEN>

{
  "issue_date": "2026-06-20",
  "contact_id": 1,
  "type_document_id": 1,
  "payment_method_id": 1,
  "type_currency_id": 1,
  "lines": [
    {
      "item_id": 1,
      "quantity": 2,
      "price": 50000,
      "description": "Servicio de desarrollo"
    }
  ]
}
```

**(Devolverá el archivo binario del PDF)** en la respuesta. Mostrará la información como `SIN NUMERACIÓN` y estado `BORRADOR`.

---

## 2. Crear Factura (`POST /v1/invoices`)

Utilizado para guardar una nueva factura en la base de datos bajo la acción seleccionada.

### Petición

```http
POST /v1/invoices
Content-Type: application/json
Authorization: Bearer <TU_TOKEN>
```

### Ejemplo de Payload (Guardar como Borrador)

> [!NOTE]
> Observa que al usar `save_action: "DRAFT"`, se puede omitir el `numbering_range_id` o enviar `null`.

```json
{
  "save_action": "DRAFT",
  "issue_date": "2026-06-20",
  "contact_id": 1,
  "type_document_id": 1,
  "payment_method_id": 1,
  "type_currency_id": 1,
  "is_flexible": true,
  "lines": [
    {
      "item_id": 1,
      "quantity": 2,
      "price": 50000,
      "description": "Servicio de desarrollo",
      "discount_percent": 0,
      "taxes": []
    }
  ]
}
```

### Ejemplo de Payload (Guardar y Emitir)

> [!IMPORTANT]
> Al usar cualquier acción distinta a `DRAFT` (ej: `EMIT`, `SAVED`, `EMAIL`), es **obligatorio** proveer el `numbering_range_id`.

```json
{
  "save_action": "EMIT",
  "numbering_range_id": 5, 
  "issue_date": "2026-06-20",
  "contact_id": 1,
  "type_document_id": 1,
  "payment_method_id": 1,
  "type_currency_id": 1,
  "is_flexible": true,
  "lines": [
    {
      "item_id": 1,
      "quantity": 2,
      "price": 50000,
      "description": "Servicio de desarrollo",
      "discount_percent": 0,
      "taxes": []
    }
  ]
}
```

---

## 3. Actualizar Factura (`PATCH /v1/invoices/{id}`)

Utilizado para editar una factura previamente guardada (solo permitido si está en estado `DRAFT` o `SAVED`). Se pueden cambiar sus datos y también su estado indicando un nuevo `save_action`.

### Petición

```http
PATCH /v1/invoices/10
Content-Type: application/json
Authorization: Bearer <TU_TOKEN>
```

### Ejemplo (Pasar Borrador a Emitida)

```json
{
  "save_action": "EMIT",
  "numbering_range_id": 5,
  "issue_date": "2026-06-20",
  "contact_id": 1,
  "lines": [
    {
      "item_id": 1,
      "quantity": 2,
      "price": 50000,
      "description": "Servicio de desarrollo",
      "discount_percent": 0,
      "taxes": []
    }
  ]
}
```

> [!CAUTION]
> Si intentas hacer un `PATCH` a una factura que ya fue emitida, anulada o pagada, la API devolverá un error `403 Forbidden` indicando que el documento ya no es editable.

---

## 4. Anular Factura (`POST /v1/invoices/{id}/cancel`)

Utilizado para cancelar internamente una factura (ej. si fue guardada pero el usuario decidió anularla para que ya no afecte cartera ni cuentas, y que no se envíe a la DIAN).

> [!WARNING]
> La anulación de la API cambiará la factura a estado `CANCELLED`. Las facturas emitidas y aceptadas por la DIAN en teoría se anulan emitiendo una **Nota Crédito**, pero este endpoint cancela el registro internamente (ej. facturas guardadas pero nunca transmitidas).

### Petición

```http
POST /v1/invoices/10/cancel
Authorization: Bearer <TU_TOKEN>
```

### Respuesta

```json
{
    "status": "success",
    "message": "La factura ha sido anulada exitosamente."
}
```
