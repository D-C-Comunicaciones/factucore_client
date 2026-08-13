# Ejemplos de Payload JSON para Notas de Crédito

A continuación se detallan los formatos exactos de JSON que el Frontend debe enviar al endpoint `POST /api/credit-notes` (o `POST /api/credit-notes/send`) dependiendo del caso o tipo de Nota Crédito.

---

## 1. Tipo 1: Devolución Parcial (Ajuste de Cantidad)
Se aplica cuando el cliente devuelve una cantidad específica de uno o más productos de **una única factura**.
- **Regla:** Solo se permite modificar la propiedad `quantity`. El precio, los impuestos y los descuentos se mantienen iguales a los de la línea original.

```json
{
    "company_id": 1,
    "customer_id": 15,
    "resolution_id": 3,
    "type_credit_note_id": 1,
    "issue_date": "2026-07-16",
    "issue_time": "10:35:00",
    "currency_id": 1,
    "observation": "Devolución de 2 unidades por defecto de fábrica.",
    "references": [
        {
            "invoice_id": 25 // ID de la factura original
        }
    ],
    "lines": [
        {
            "credit_note_reference_index": 0, // Índice 0 apunta a "references[0]"
            "invoice_line_id": 155,           // ID de la línea original de la factura
            "quantity": 2,                    // Cantidad que se está devolviendo
            "price": 50000,                   // Mismo precio de la factura
            "taxes": [
                {
                    "tax_id": 1,              // ID del impuesto original (ej: IVA)
                    "percent": 19
                }
            ]
        }
    ]
}
```

---

## 2. Tipo 2: Anulación Completa de la Factura
Se utiliza para anular la factura al 100%. Al utilizar el tipo de Nota Crédito **"Anulación de factura"** (`type_credit_note_id: 2`), ya no es necesario enviar los arreglos de líneas, clientes, descuentos o impuestos.
El sistema buscará la factura original por su `invoice_id` y reconstruirá la nota crédito exactamente con sus mismos valores e importes.

```json
{
  "credit_notes": [
    {
      "resolution_id": 5,
      "type_credit_note_id": 2,
      "type_currency_id": 1,
      "invoice_id": 10452,
      "date": "2026-07-30",
      "reason": "Anulación total por solicitud del cliente",
      "notes": "Se anula la factura completamente debido a un error comercial.",
      "send_mail": true
    }
  ]
}
```

### Explicación de los campos requeridos mínimos:
- `resolution_id`: **Requerido**. ID de la resolución de numeración.
- `type_credit_note_id`: **Requerido**. Debe ser `2` para invocar este comportamiento de anulación total.
- `type_currency_id`: **Requerido**. ID de la moneda.
- `invoice_id`: **Requerido**. ID de la factura original.
- `date`: Opcional.
- `reason` / `notes`: Opcional.
- `send_mail`: Opcional.

> [!NOTE]
> **No envíes** los nodos `lines`, `customer`, `global_discounts`, `global_charges` ni impuestos. Cualquier dato enviado en esos arreglos será ignorado, ya que el sistema forzará una copia idéntica a nivel matemático de la factura origen referenciada en `invoice_id`.

---

## 3. Tipo 3 y 6: Rebaja / Descuento a Líneas
Se utiliza cuando la cantidad vendida fue correcta, pero se le quiere otorgar un descuento posterior al cliente.
- **Regla:** La cantidad y precio se mantienen. Solo se aplica un valor en `discount` o `discount_percentage`. El backend recalculará el IVA y Retenciones sobre la nueva base gravable.

```json
{
    "company_id": 1,
    "customer_id": 15,
    "resolution_id": 3,
    "type_credit_note_id": 3,
    "observation": "Descuento del 10% por demora en entrega.",
    "references": [
        {
            "invoice_id": 25
        }
    ],
    "lines": [
        {
            "credit_note_reference_index": 0,
            "invoice_line_id": 155,
            "quantity": 10,
            "price": 50000,
            "discount_percentage": 10, // <- Aquí va el descuento
            "taxes": [{"tax_id": 1, "percent": 19}]
        }
    ]
}
```

---

## 4. Tipo 4: Ajuste de Precio
El cliente compró a un precio mayor por error y se hace una Nota Crédito por la diferencia.
- **Regla:** La cantidad se mantiene. Se envía el **nuevo precio** de la línea.

```json
{
    "company_id": 1,
    "customer_id": 15,
    "resolution_id": 3,
    "type_credit_note_id": 4,
    "observation": "Ajuste de precio unitario.",
    "references": [
        {
            "invoice_id": 25
        }
    ],
    "lines": [
        {
            "credit_note_reference_index": 0,
            "invoice_line_id": 155,
            "quantity": 10,
            "price": 45000, // <- El precio se redujo de 50000 a 45000
            "taxes": [{"tax_id": 1, "percent": 19}]
        }
    ]
}
```

---

## 5. Tipo 5: Múltiples Facturas y Líneas Manuales
Este es el único tipo que permite referenciar **varias facturas** al tiempo o crear **líneas libres (sin `invoice_line_id`)**.
- **Regla:** Las líneas deben indicar obligatoriamente el `credit_note_reference_index` para saber a qué factura pertenecen. Si es una línea manual, se omite el `invoice_line_id`.

```json
{
    "company_id": 1,
    "customer_id": 15,
    "resolution_id": 3,
    "type_credit_note_id": 5,
    "observation": "Acreditación por bonos semestrales.",
    "references": [
        { "invoice_id": 25 }, // Índice 0
        { "invoice_id": 28 }  // Índice 1
    ],
    "lines": [
        {
            // Línea que pertenece a la factura 25 (Índice 0)
            "credit_note_reference_index": 0, 
            "description": "Línea libre por bonificación (Factura 25)", 
            "quantity": 1,
            "price": 100000,
            "taxes": [{"tax_id": 1, "percent": 19}]
            // No se envía invoice_line_id porque es manual
        },
        {
            // Línea que pertenece a la factura 28 (Índice 1)
            "credit_note_reference_index": 1, 
            "invoice_line_id": 201, // Línea real de la base de datos
            "quantity": 1,
            "price": 50000,
            "taxes": [{"tax_id": 1, "percent": 19}]
        }
    ]
}
```

---

### Detalles Importantes para el Frontend:
1. **`credit_note_reference_index`:** Es crucial para enlazar cada línea con su respectiva factura en la base de datos, especialmente si el payload trae varias facturas (Tipo 5). Siempre usa índice base `0`.
2. **`taxes` y `withholdings`:** Solo se requiere enviar el `tax_id` o `withholding_id` y su `percent`. El Backend (CalculationService) se encarga de calcular los montos y bases gravables matemáticamente de manera exacta, por lo que **el frontend no debe enviar los valores en dinero (montos) de los impuestos ni de la nota final**.
3. **`type_credit_note_id`:** Es el tipo de operación. Validar con los IDs del backend (ej: 1=Devolución, 2=Anulación, 3=Rebaja, 4=Ajuste Precio, 5=Múltiple).
