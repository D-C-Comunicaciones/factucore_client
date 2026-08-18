# Órdenes de compra: ajustes de descuentos, impuestos y cargos globales

Actúa como **desarrollador Frontend senior** de Factucore. Este prompt actualiza
el trabajo de órdenes de compra: además de la separación Ingresos/Gastos ya
pedida antes, el backend ahora calcula **descuentos e impuestos por línea** y
**cargos/descuentos globales**, exactamente igual que en Cotizaciones y
Remisiones. Si el formulario de "orden de compra" ya quedó armado sin esto,
hay que completarlo.

## Recapitulación: dos tipos de orden de compra (sigue igual)

| Tipo | Quién la genera | Dónde vive en el menú | Consecutivo |
|---|---|---|---|
| `internal` | El tenant, para comprarle a su proveedor | **Gastos → Órdenes de compra** | Automático por resolución |
| `external` | La entrega un cliente, para asociarla a su factura | **Ingresos → Órdenes de compra (recibidas)** | Manual (`reference`, digitado por el usuario) |

Todo lo de esa separación (menú, formulario sin selector de resolución para
`external`, filtro `?contact_id=` que sólo devuelve externas, asociación a
factura sólo con `purchase_order_id`) sigue vigente. Lo nuevo de este prompt
aplica **a ambos tipos por igual**.

## Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales

Antes cada línea de una orden de compra sólo tenía `quantity` × `unit_price` =
`line_total`, sin impuestos ni descuentos, y no existían ajustes globales.
Ahora el motor de cálculo es **el mismo que ya usan Cotizaciones y
Remisiones** — mismo formato de payload, mismas reglas de cálculo. Si ya
tienen el formulario de items con descuentos/impuestos/cargos hecho para
cotizaciones, es literalmente el mismo componente reutilizado acá.

### Qué hay que agregar al formulario de items

Por cada línea (item) de la orden:
- **Descuentos/cargos de línea** (`allowance_charges` dentro del item): tipo
  porcentaje o valor fijo, con motivo opcional. Igual que en cotizaciones.
- **Impuestos de línea** (`taxes` dentro del item): IVA u otro impuesto,
  porcentaje o valor fijo por unidad.

Y a nivel de todo el documento:
- **Ajustes globales** (`allowance_charges` en la raíz del payload, con
  `scope: "global"`): por ejemplo flete, o un descuento general sobre el
  subtotal ya con impuestos/descuentos de línea aplicados.

### Contrato de API actualizado

**`POST /purchase-orders`** (sirve para `external` e `internal`, la única
diferencia sigue siendo `type`/`reference`/`resolution_id` como ya se explicó):

```json
{
  "type": "external",
  "contact_id": 123,
  "reference": "PO-2026-00458",
  "items": [
    {
      "item_id": 10,
      "description": "Servicio de consultoría",
      "quantity": 10,
      "unit_price": 1000,
      "allowance_charges": [
        {
          "scope": "line",
          "value_type": "percentage",
          "charge_indicator": false,
          "value": 10,
          "reason": "Descuento comercial"
        }
      ],
      "taxes": [
        { "rate": 19, "type": "percentage", "name": "IVA", "tax_code": "01" }
      ]
    }
  ],
  "allowance_charges": [
    {
      "scope": "global",
      "value_type": "fixed",
      "charge_indicator": true,
      "value": 500,
      "reason": "Flete"
    }
  ]
}
```

Notas del formato (idéntico a cotizaciones/remisiones):
- `charge_indicator: true` = es un cargo (suma); `false` = es un descuento (resta).
- `value_type`: `"percentage"` (se calcula sobre la base de la línea o del subtotal global) o `"fixed"` (valor absoluto).
- `scope` dentro de `items[].allowance_charges` siempre es `"line"`. `scope` en el array raíz `allowance_charges` siempre es `"global"`.
- Los impuestos de línea (`taxes[].rate`) se calculan **después** de aplicar los descuentos/cargos de línea (sobre `line_extension_amount`, no sobre `quantity × unit_price`).
- `items[].taxes[].type: "fixed"` calcula el impuesto como `rate × quantity` (ej. impuestos por unidad) en vez de un porcentaje.

Todos esos campos son **opcionales** — una orden sin descuentos/impuestos/cargos sigue funcionando igual que antes, simplemente esos totales quedan en 0.

### La respuesta ahora trae totales reales

El objeto `purchase_order` en la respuesta (`POST`/`GET`/`PATCH`) ahora incluye:

```json
{
  "line_extension_amount": 9000.00,
  "discount_total": 1000.00,
  "charge_total": 500.00,
  "tax_total": 1710.00,
  "total": 11210.00,
  "lines": [
    {
      "quantity": 10,
      "unit_price": 1000,
      "line_extension_amount": 9000.00,
      "discount_amount": 1000.00,
      "tax_amount": 1710.00,
      "line_total": 10710.00,
      "discounts": [ /* detalle de cada descuento/cargo de línea aplicado */ ],
      "charges": [],
      "taxes": [ /* detalle de cada impuesto de línea aplicado */ ]
    }
  ]
}
```

Y en `GET /purchase-orders/{id}` (detalle), además de `lines[].taxes/charges/discounts`, vienen `global_charges` y `global_discounts` con los ajustes globales del documento (equivalente a `globalCharges`/`globalDiscounts` en cotizaciones).

**Usar estos totales tal cual vienen del backend** — no recalcular en el frontend. Los cálculos (redondeos, orden de aplicación descuento→impuesto→cargo global) los hace el backend para que cuadren con lo que luego se factura.

### Edición (`PATCH /purchase-orders/{id}`)

Importante — esto cambió respecto a antes: **ya no existen** `items_to_add` / `items_to_remove` (edición parcial de items). Ahora, igual que en cotizaciones, para editar los items hay que reenviar el arreglo `items` **completo** (con sus `allowance_charges`/`taxes` si aplican) más el `allowance_charges` global si aplica — el backend borra y recalcula todo el set de líneas/ajustes/totales juntos, porque los totales dependen del conjunto completo, no de un item aislado.

En la práctica: si el formulario de edición ya carga todos los items en una tabla editable (como debería ser para cotizaciones), el submit de "guardar cambios" simplemente manda esa tabla completa en `items`, igual que al crear.

## Resumen de lo que hay que construir/ajustar

1. En el formulario de items de la orden de compra (ambos tipos), agregar los mismos controles de descuento/cargo de línea e impuesto de línea que ya existen en el formulario de Cotizaciones — mismo payload, se puede reutilizar el componente.
2. Agregar la sección de "ajustes globales" del documento (cargo/descuento a nivel de toda la orden), igual que en Cotizaciones.
3. Mostrar en el resumen/totales de la orden: subtotal (`line_extension_amount`), descuentos (`discount_total`), cargos (`charge_total`), impuestos (`tax_total`) y total (`total`) — todos vienen calculados del backend.
4. En la vista de detalle, mostrar el desglose de impuestos/descuentos/cargos por línea y los ajustes globales del documento.
5. Si el formulario de edición usaba `items_to_add`/`items_to_remove`, migrarlo a reenviar siempre el arreglo `items` completo (igual que Cotizaciones).
