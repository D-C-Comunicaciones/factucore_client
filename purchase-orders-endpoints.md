# Órdenes de compra (`purchase_orders`) — CRUD y guía de integración

Todos los endpoints requieren tenant activo y viven bajo el middleware de módulo `module:purchase_orders` (el tenant debe tener el módulo habilitado en su plan) más el permiso/feature indicado en cada uno.

## Resumen rápido

| Acción | Método | Endpoint | Permiso | Feature (plan) |
|---|---|---|---|---|
| Listar | `GET` | `/v1/purchase-orders` | `purchase_orders.view` | — |
| Detalle | `GET` | `/v1/purchase-orders/{id}` | `purchase_orders.view` | — |
| Crear | `POST` | `/v1/purchase-orders` | `purchase_orders.create` | `create_purchase_order` |
| Editar | `PATCH` | `/v1/purchase-orders/{id}` | `purchase_orders.edit` | `edit_purchase_order` |
| Eliminar | `DELETE` | `/v1/purchase-orders/{id}` | `purchase_orders.delete` | `delete_purchase_order` |

---

## `external` vs `internal` — la diferencia que maneja todo el CRUD

El campo `type` (obligatorio al crear, **no editable después**) define dos flujos completamente distintos:

| | `external` | `internal` |
|---|---|---|
| Qué es | La orden de compra que **un cliente** entrega para que se le facture (ej. PDF/número que manda por correo) | Una orden que **el tenant genera** para comprarle a un proveedor |
| Consecutivo | Manual — lo escribe quien registra la orden, en `reference` | Automático — lo asigna una `resolution_id` de tipo `PURCHASE_ORDER`, igual que facturas/cotizaciones (`prefix` + `number` los calcula el backend) |
| Campo `reference` | **Obligatorio** | **Prohibido** (la API rechaza la request si se envía) |
| Campo `resolution_id` | **Prohibido** | **Obligatorio** — debe existir, estar vigente (`isCurrentlyValid()`) y tener numeración disponible; si la resolución no es de tipo `PURCHASE_ORDER`, `422` |
| Unicidad | `reference` única por `contact_id` (dos clientes distintos pueden repetir el mismo número de orden, un mismo cliente no) | `prefix` + `number` únicos por `resolution_id` (igual que facturas) |
| Filtro en listado | Si se filtra `GET /v1/purchase-orders?contact_id=2`, la API **fuerza `type=external`** — las internas no aplican a ese flujo (son compras a proveedor, no del cliente) | — |

Estas reglas están en `StorePurchaseOrderRequest` (`required_if`/`prohibited_if` sobre `type`) y en `PurchaseOrderService::createPurchaseOrder()`.

---

## 1. Crear orden de compra

**`POST /v1/purchase-orders`**

### Ejemplo — `external` (orden del cliente)

```json
{
  "type": "external",
  "contact_id": 2,
  "reference": "OC-CLIENTE-4521",
  "issue_date": "2026-08-04",
  "notes": "Orden enviada por el cliente vía correo",
  "status": "open",
  "items": [
    {
      "item_id": 2,
      "description": "Consultoría IT",
      "quantity": 1,
      "unit_price": 1200000,
      "allowance_charges": [
        {
          "scope": "line",
          "value_type": "percentage",
          "charge_indicator": false,
          "value": 15,
          "reason": "Descuento comercial"
        }
      ],
      "taxes": [
        { "tax_rate_id": 1, "rate": 19, "type": "percentage", "name": "IVA" }
      ]
    }
  ],
  "allowance_charges": [
    {
      "scope": "global",
      "value_type": "fixed",
      "charge_indicator": true,
      "value": 15000,
      "reason": "Domicilio"
    }
  ]
}
```

- `resolution_id` **no se envía** (rechazado con `422` si se manda, por `prohibited_if:type,external`).
- `reference` es obligatorio y libre (no lo genera el backend).
- `invoice_id` y `cost_center_id` son opcionales en ambos tipos; si se omite `cost_center_id`, se autoasigna desde el centro de costo por defecto del contexto (`AssignsCostCenter`, mismo comportamiento que cotizaciones/remisiones).

### Ejemplo — `internal` (compra a proveedor)

```json
{
  "type": "internal",
  "contact_id": 8,
  "resolution_id": 6,
  "issue_date": "2026-08-18",
  "notes": "Reposición de stock trimestral",
  "status": "open",
  "items": [
    {
      "item_id": 15,
      "quantity": 50,
      "unit_price": 8000,
      "taxes": [
        { "tax_rate_id": 1, "rate": 19, "type": "percentage", "name": "IVA" }
      ]
    }
  ]
}
```

- `reference` **no se envía** (rechazado con `422` si se manda, por `prohibited_if:type,internal`).
- `resolution_id` es obligatorio y debe apuntar a una resolución de tipo `PURCHASE_ORDER`, vigente y con numeración disponible — el backend calcula `prefix`/`number` solo, no se mandan.
- Si la resolución tiene numeración automática, se usa `max(current_number + 1, from_number)`; si no, se usa `current_number` tal cual (numeración manual).

### Body de cada línea en `items[]`

| Campo | Obligatorio | Notas |
|---|---|---|
| `item_id` | No | Si se omite, la línea queda "libre" (sin producto del catálogo), usando `description` propio |
| `description` | No | Si se omite y hay `item_id`, se usa la descripción del item |
| `quantity` | Sí | Numérico, mínimo `0.000001` |
| `unit_price` | Sí | Numérico, mínimo `0` |
| `allowance_charges[]` | No | Descuentos/cargos de línea — ver abajo |
| `taxes[]` | No | Impuestos de línea — `rate` obligatorio si se manda el array; `type: "percentage"` calcula sobre el valor neto de la línea (después de descuentos/cargos), `type: "fixed"` multiplica `rate * quantity` |

### `allowance_charges[]` (a nivel de línea o global, mismo shape)

| Campo | Obligatorio | Valores |
|---|---|---|
| `scope` | Sí | `"line"` (dentro de `items[].allowance_charges`) o `"global"` (a nivel de orden, en el array raíz `allowance_charges`) |
| `value_type` | Sí | `"percentage"` (se calcula sobre la base de la línea o el subtotal global) o `"fixed"` (monto exacto) |
| `charge_indicator` | Sí | `true` = cargo (suma), `false` = descuento (resta) |
| `value` | Sí | Numérico, mínimo `0` — porcentaje o monto fijo según `value_type` |
| `reason` | No | Texto libre, máx 255 |
| `reason_code` | No | Máx 20 |

Los descuentos/cargos globales (`scope: "global"` en el array raíz `allowance_charges`) se calculan sobre la suma de `line_extension_amount` de todas las líneas, **después** de aplicar los descuentos/cargos de línea.

Respuesta `201` — objeto completo con `lines` (cada una con `item`, `taxes`, `charges`, `discounts`), `globalCharges`, `globalDiscounts` y los totales ya calculados (`line_extension_amount`, `discount_total`, `charge_total`, `tax_total`, `total`).

Errores `422` típicos:
- `{"message": "La resolución seleccionada ya no existe."}`
- `{"message": "La resolución seleccionada está vencida o fuera de vigencia."}`
- `{"message": "La resolución seleccionada no tiene numeración disponible."}`
- `{"message": "La resolución seleccionada no corresponde a órdenes de compra."}`
- `{"message": "Ya existe una orden de compra con el consecutivo SETP123 para la resolución seleccionada."}`
- Errores de validación estándar (ej. `reference` faltante en `external`, `resolution_id` presente en `external`, etc.)

---

## 2. Listar órdenes de compra

**`GET /v1/purchase-orders`**

Filtros (query params, todos opcionales):

| Param | Efecto |
|---|---|
| `search` | Busca en `reference`, `notes`, `status` (`LIKE`) |
| `contact_id` | Filtra por cliente — **fuerza `type=external`** automáticamente |
| `type` | `external` o `internal` (se ignora si se manda `contact_id`) |
| `invoice_id` | Órdenes ya asociadas a una factura puntual |
| `status` | Coincidencia exacta |
| `per_page` | 1–100, default 20 |

```json
{
  "customMessage": "Órdenes de compra obtenidas exitosamente.",
  "purchase_orders": [
    {
      "id": 3,
      "invoice_id": null,
      "contact_id": 2,
      "type": "external",
      "reference": "OC-CLIENTE-4521",
      "status": "open",
      "total": "1213800.00",
      "contact": { "id": 2, "registration_name": "MANUEL ARTURO MACEA GARIZADO", "identification_number": 1143255673, "email": "marcea.manuel@gmail.com" },
      "invoice": null,
      "resolution": null,
      "lines": [
        { "id": 5, "item_id": 2, "description": "Consultoría IT", "quantity": "1.000000", "unit_price": "1200000.00", "line_total": "1213800.00", "item": { "id": 2, "reference": "CONS-IT", "name": "Consultoría IT" } }
      ]
    }
  ],
  "pagination": { "total": 1, "per_page": 20, "current_page": 1, "last_page": 1 }
}
```

El listado trae una versión **liviana** de cada línea (sin `taxes`/`charges`/`discounts` de línea) — para el detalle completo con impuestos y ajustes, usar el endpoint de detalle (punto 3).

---

## 3. Detalle de una orden de compra

**`GET /v1/purchase-orders/{id}`**

```json
{
  "customMessage": "Orden de compra obtenida exitosamente.",
  "purchase_order": {
    "id": 3,
    "invoice_id": null,
    "contact_id": 2,
    "type": "external",
    "resolution_id": null,
    "prefix": null,
    "number": null,
    "reference": "OC-CLIENTE-4521",
    "issue_date": "2026-08-04",
    "notes": "Orden enviada por el cliente vía correo",
    "status": "open",
    "line_extension_amount": "1020000.00",
    "discount_total": "180000.00",
    "charge_total": "15000.00",
    "tax_total": "193800.00",
    "total": "1048800.00",
    "created_at": "...",
    "updated_at": "...",
    "deleted_at": null,
    "contact": { "id": 2, "registration_name": "MANUEL ARTURO MACEA GARIZADO", "identification_number": 1143255673, "email": "marcea.manuel@gmail.com", "phone1": null, "address": null },
    "invoice": null,
    "resolution": null,
    "lines": [
      {
        "id": 5,
        "purchase_order_id": 3,
        "item_id": 2,
        "description": "Consultoría IT",
        "quantity": "1.000000",
        "unit_price": "1200000.00",
        "line_extension_amount": "1020000.00",
        "discount_amount": "180000.00",
        "tax_amount": "193800.00",
        "line_total": "1213800.00",
        "item": { "id": 2, "reference": "CONS-IT", "name": "Consultoría IT", "description": "Consultoría IT" },
        "taxes": [ { "id": 3, "name": "IVA", "percent": "19.000000", "tax_amount": "193800.00" } ],
        "charges": [],
        "discounts": [ { "id": 4, "value_type": "percentage", "value": "15.00", "calculated_amount": "180000.00", "reason": "Descuento comercial" } ]
      }
    ],
    "globalCharges": [ { "id": 1, "value_type": "fixed", "value": "15000.00", "calculated_amount": "15000.00", "reason": "Domicilio" } ],
    "globalDiscounts": []
  }
}
```

`404` con `{"message": "Orden de compra no encontrada."}` si el id no existe.

---

## 4. Editar orden de compra

**`PATCH /v1/purchase-orders/{id}`**

**No editables una vez creada**: `type`, `resolution_id`, `prefix`, `number` (romperían la numeración ya consumida — no están en `UpdatePurchaseOrderRequest` y cualquier intento de mandarlos se ignora).

Campos editables sueltos: `invoice_id`, `contact_id`, `issue_date`, `reference`, `notes`, `status`.

```json
{
  "notes": "Cliente confirmó cambio de cantidad",
  "status": "closed"
}
```

**`items` se reemplaza completo, no se puede editar parcialmente**: si se manda `items` en el body, se borran todas las líneas/impuestos/descuentos de línea y los ajustes globales existentes, y se recrean desde cero con lo que llegue — igual formato que en la creación (mismo `items[]` + `allowance_charges[]` de arriba). Los totales se recalculan con el mismo algoritmo.

```json
{
  "items": [
    {
      "item_id": 2,
      "quantity": 2,
      "unit_price": 1200000,
      "taxes": [ { "rate": 19, "type": "percentage", "name": "IVA" } ]
    }
  ]
}
```

Si no se manda `items`, las líneas existentes no se tocan.

Respuesta `200` — mismo shape que el detalle. `404` si el id no existe, `422` con el mensaje de la excepción si algo en el nuevo set de items no cuadra.

---

## 5. Eliminar orden de compra

**`DELETE /v1/purchase-orders/{id}`**

```json
{ "customMessage": "Orden de compra eliminada exitosamente." }
```

Es **borrado lógico** (`PurchaseOrder` usa `SoftDeletes`).

⚠️ **Restricción**: si la orden ya tiene `invoice_id` (está asociada a una factura), la API responde `422` con `{"message": "No se puede eliminar la orden de compra porque ya está asociada a una factura."}` — hay que desvincularla de la factura antes (o no se puede eliminar mientras esa factura exista).

---

## Notas de integración

- El módulo completo depende del flag `module:purchase_orders` del plan del tenant — si no está habilitado, todos los endpoints devuelven el 403 estándar de módulo no disponible, independiente de permisos de usuario.
- `create`/`edit`/`delete` además requieren el feature del plan (`create_purchase_order`, `edit_purchase_order`, `delete_purchase_order`) — un tenant puede tener el módulo pero no todas las acciones según su plan.
- Para vincular una orden `external` a una factura al facturar, ver `purchase_order_id` en el body de creación de la factura (`app/Services/Invoice/InvoiceService.php`) — no hay un endpoint separado para "asociar"; se manda al crear/actualizar la factura.
- El detalle de factura (`GET /v1/invoices/{id}`) devuelve la orden de compra asociada dentro de `purchase_orders` (array) — ver [invoice-detail-example.json](invoice-detail-example.json).
