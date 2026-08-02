# Especificación Frontend - Creación de Notas Crédito

Este documento es la guía definitiva para implementar el formulario de creación de Notas Crédito en el frontend, alineado con la lógica de la DIAN y la API.

---

## 1. Introducción

Existen dos grandes grupos de notas crédito al momento de afectar una factura de venta:

### A. Anulación total de factura
Corresponde estrictamente al tipo **Anulación de factura**.
En este escenario, el frontend **NO debe permitir editar** productos, cantidades, impuestos, descuentos ni cargos. La interfaz debe bloquearse para edición de valores y únicamente debe enviar:
- `invoice_id` (factura origen)
- `type_credit_note_id` (motivo de anulación)
- `observation` (observación libre)

El backend es responsable de copiar completamente la factura original, generar la nota crédito idéntica (con valores invertidos o de ajuste total) y no se debe recalcular nada en el cliente.

### B. Nota crédito parcial
Incluye todos los demás tipos de afectación:
- Devolución parcial de bienes y/o no aceptación parcial del servicio
- Rebaja o descuento parcial o total
- Ajuste de precio
- Otros
- Descuento comercial por pronto pago
- Descuento comercial por volumen de ventas

En estos casos, el usuario **SÍ debe poder editar** la información. El frontend será el responsable absoluto de construir completamente la nueva nota crédito, incluyendo el cálculo preciso de impuestos, descuentos y totales proporcionales.

---

## 2. Diferencia entre flujos

| Característica | A. Anulación Total | B. Nota Crédito Parcial |
|---|---|---|
| **Quién calcula** | Backend | Frontend |
| **Quién copia** | Backend | Frontend (solo las líneas a afectar) |
| **Quién edita** | Nadie (bloqueado) | Usuario (cantidades, precios, etc.) |
| **Qué se envía** | ID factura, motivo, observación | ID factura, motivo, obs, y todo el arreglo de `lines`, `taxes`, `discounts` afectado |
| **Qué NO enviar** | Arreglos de líneas, impuestos o totales | Totales arbitrarios sin cálculo |

---

## 3. Casos que debe soportar el frontend (y 7. Ejemplos JSON)

A continuación, se detallan los casos. El formato JSON esperado por el API para notas crédito parciales sigue esta estructura:

### Caso 1: Factura sin impuestos, descuentos ni cargos
- **Comportamiento:** Se devuelve 1 ítem de 2. El total debe ser el valor unitario por 1.
- **Cálculo:** `quantity * price`.
```json
{
  "invoice_id": 100,
  "type_credit_note_id": 2,
  "observation": "Devolución de 1 unidad",
  "lines": [
    {
      "item_id": 1,
      "quantity": 1,
      "price": 50000,
      "taxes": [],
      "discounts": [],
      "charges": []
    }
  ],
  "global_discounts": [],
  "global_charges": []
}
```

### Caso 2: Factura con IVA por línea
- **Cálculo:** `subtotal = qty * price`. `tax_amount = subtotal * 0.19`.
```json
{
  "invoice_id": 100,
  "type_credit_note_id": 2,
  "observation": "Devolución parcial con IVA",
  "lines": [
    {
      "item_id": 2,
      "quantity": 1,
      "price": 100000,
      "taxes": [
        { "tax_id": 1, "rate": 19, "amount": 19000 }
      ],
      "discounts": [],
      "charges": []
    }
  ]
}
```

### Caso 3: Factura con varios impuestos por línea (Ej: IVA + Impoconsumo)
- **Cálculo:** Ambos impuestos se calculan sobre la base (subtotal).
```json
{
  "invoice_id": 100,
  "type_credit_note_id": 2,
  "observation": "Devolución con IVA e INC",
  "lines": [
    {
      "item_id": 3,
      "quantity": 2,
      "price": 20000,
      "taxes": [
        { "tax_id": 1, "rate": 19, "amount": 7600 },
        { "tax_id": 2, "rate": 8, "amount": 3200 }
      ],
      "discounts": [],
      "charges": []
    }
  ]
}
```

### Caso 4: Factura con descuento por línea
- **Cálculo:** `subtotal = (qty * price) - discount`.
```json
{
  "invoice_id": 100,
  "type_credit_note_id": 4, 
  "observation": "Descuento aplicado",
  "lines": [
    {
      "item_id": 4,
      "quantity": 1,
      "price": 50000,
      "taxes": [],
      "discounts": [
        { "discount_id": 1, "percentage": 10, "amount": 5000 }
      ],
      "charges": []
    }
  ]
}
```

### Caso 5: Factura con varios descuentos por línea
```json
{
  "invoice_id": 100,
  "type_credit_note_id": 4,
  "observation": "Múltiples descuentos",
  "lines": [
    {
      "item_id": 5,
      "quantity": 1,
      "price": 100000,
      "taxes": [],
      "discounts": [
        { "percentage": 10, "amount": 10000 },
        { "percentage": 5, "amount": 4500 }
      ],
      "charges": []
    }
  ]
}
```

### Caso 6 al 14: Combinaciones de Cargos e Impuestos
El frontend debe comportarse idénticamente a como lo hace en la creación de facturas, respetando que la Nota Crédito es un "espejo proporcional" de la factura. Si se devuelve la mitad de la mercancía, el cargo por línea y el descuento global deben prorratearse a la mitad.

### Caso 15: Completo (Impuestos + Desc + Cargos por línea y globales)
- **Cálculo:** 
  1. Base de línea = `(qty * price) + cargos_linea - descuentos_linea`.
  2. Impuestos de línea sobre la base de línea.
  3. Descuentos/Cargos globales prorrateados al subtotal de la nota.
```json
{
  "invoice_id": 100,
  "type_credit_note_id": 2,
  "observation": "Devolución compleja",
  "lines": [
    {
      "item_id": 15,
      "quantity": 1,
      "price": 100000,
      "taxes": [{ "tax_id": 1, "rate": 19, "amount": 18050 }],
      "discounts": [{ "percentage": 10, "amount": 10000 }],
      "charges": [{ "percentage": 5, "amount": 5000 }]
    }
  ],
  "global_discounts": [{ "percentage": 2, "amount": 1900 }],
  "global_charges": [{ "percentage": 1, "amount": 950 }]
}
```

---

## 4. Cómo construir una Nota Crédito parcial

- **NO se copia el total de la factura:** Si la factura original era de 10 unidades y se devuelven 2, la nota crédito es solo por 2.
- **Se incluyen:** Solo las líneas afectadas, cantidades a devolver/ajustar, impuestos, descuentos y cargos proporcionales a esa nueva base.
- **Recálculo total:** El frontend debe ejecutar el mismo motor de cálculo (tax engine) que usa para facturación. Nunca se envían valores arbitrarios.

---

## 5. Casos especiales

- **Devolución de cantidad parcial:** Se reduce la cantidad, se recalcula precio base e impuestos.
- **Devolución de línea completa:** Se envía la línea intacta, igual a la factura original.
- **Rebaja de precio sin modificar cantidad:** La cantidad se mantiene, el `price` baja, generando la diferencia.
- **Pronto pago / Volumen de ventas:** Suelen manejarse como descuentos globales sobre toda la factura, afectando el total general.

---

## 6. Validaciones (Frontend)

1. **Cantidades:** `qty_nota_credito <= qty_factura_restante`.
2. **Impuestos:** No generar impuestos negativos o tasas inventadas (debe coincidir con las tasas de la factura original).
3. **Descuentos:** `total_descuento <= subtotal_linea`.
4. **Cargos negativos:** No se permiten.
5. **Inconsistencias:** El `total` de la nota crédito debe ser igual a la suma de líneas + impuestos - descuentos + cargos.
6. **Líneas vacías:** No permitir agregar líneas con cantidad 0 o vacías.
7. **Referencia:** Validar siempre que `invoice_id` exista.
8. **Total:** Nunca menor a cero.

---

## 8. Ejemplos visuales
*Para cada escenario, la interfaz debería presentar una tabla tipo "espejo" de la factura original, donde los campos como 'Cantidad a devolver' sean inputs numéricos limitados al máximo facturado. Al cambiar el input, la fila actualiza instantáneamente su IVA y Total.*

---

## 9. Resumen final

| Tipo NC | Info Editable | Frontend Calcula | Backend Calcula | JSON |
|---|---|---|---|---|
| Anulación | Nada | Nada | Todo (copia fiel) | `{ "invoice_id": 1, "type": 1, "obs": "..." }` |
| Devolución parcial | Cantidades | Líneas, impuestos, totales proporcionales | Validaciones de integridad | `{ "invoice_id": 1, "type": 2, "lines": [...] }` |
| Ajuste de precio | Precios unitarios | Recálculo de base e impuestos | Validaciones de integridad | `{ "invoice_id": 1, "type": 3, "lines": [...] }` |
| Descuento Global | % de descuento global | Distribución del descuento | Validaciones de integridad | `{ "invoice_id": 1, "type": 5, "global_discounts": [...] }` |
