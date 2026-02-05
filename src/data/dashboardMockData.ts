export const flujoTransaccionesMock = {
  data: [
    { fecha: '1 feb', ingresos: 500, egresos: 300 },
    { fecha: '3 feb', ingresos: 800, egresos: 450 },
    { fecha: '5 feb', ingresos: 1200, egresos: 600 },
    { fecha: '7 feb', ingresos: 950, egresos: 500 },
    { fecha: '9 feb', ingresos: 1400, egresos: 700 },
    { fecha: '11 feb', ingresos: 1100, egresos: 550 },
    { fecha: '13 feb', ingresos: 1600, egresos: 800 },
    { fecha: '15 feb', ingresos: 1300, egresos: 650 },
    { fecha: '17 feb', ingresos: 1800, egresos: 900 },
    { fecha: '19 feb', ingresos: 1500, egresos: 750 },
  ],
  totalIngresos: 12250.00,
  totalEgresos: 6200.00,
  porcentajeIngresos: 0,
  porcentajeEgresos: 0,
};

export const totalVentasMock = {
  data: [
    { fecha: '1 de feb', valor: 850 },
    { fecha: '5 de feb', valor: 1200 },
    { fecha: '10 de feb', valor: 2100 },
    { fecha: '15 de feb', valor: 1750 },
    { fecha: '20 de feb', valor: 2800 },
    { fecha: '25 de feb', valor: 2350 },
    { fecha: '28 de feb', valor: 3200 },
  ],
  total: 14250.00,
  porcentaje: 15,
};

export const distribucionGastosMock = {
  gastos: [
    { concepto: 'Gastos de venta', valor: 150.50, porcentaje: 45, color: '#ef4444' },
    { concepto: 'Gastos de personal de ventas', valor: 100.00, porcentaje: 30, color: '#3b82f6' },
    { concepto: 'Sueldos personal de ventas', valor: 50.25, porcentaje: 15, color: '#6366f1' },
    { concepto: 'Horas extras y recargos personal de ventas', valor: 20.00, porcentaje: 6, color: '#14b8a6' },
    { concepto: 'Comisiones personal de ventas', valor: 13.25, porcentaje: 4, color: '#f59e0b' },
  ],
  total: 334.00,
};

export const cuentasPorCobrarMock = {
  total: 5250.75,
  vigentes: { valor: 3500.50, documentos: 12 },
  vencidas: { valor: 1750.25, documentos: 5 },
};

export const cuentasPorPagarMock = {
  total: 3890.00,
  vigentes: { valor: 2340.00, documentos: 8 },
  vencidas: { valor: 1550.00, documentos: 3 },
};

export const impuestosMock = {
  total: 1245.80,
};

export const productosVendidosMock = {
  total: 287,
};

export const devolucionesMock = {
  total: 150.50,
};

export const clientesConVentasMock = {
  total: 45,
};

export const productosMasVendidosMock = {
  productos: [
    { nombre: 'Producto Premium A', cantidad: 150, ventas: 4500.00, porcentaje: 35 },
    { nombre: 'Producto Estándar B', cantidad: 120, ventas: 3600.00, porcentaje: 28 },
    { nombre: 'Producto Economy C', cantidad: 90, ventas: 2700.00, porcentaje: 21 },
    { nombre: 'Producto Deluxe D', cantidad: 60, ventas: 1800.00, porcentaje: 14 },
    { nombre: 'Producto Basic E', cantidad: 30, ventas: 900.00, porcentaje: 7 },
  ],
  total: 13500.00,
};

export const mejoresClientesMock = {
  clientes: [
    { nombre: 'Empresa ABC S.A.S', documentos: 25, ventas: 12500.00, porcentaje: 40 },
    { nombre: 'Comercial XYZ Ltda', documentos: 18, ventas: 8500.00, porcentaje: 27 },
    { nombre: 'Distribuidora DEF', documentos: 15, ventas: 6000.00, porcentaje: 19 },
    { nombre: 'Inversiones GHI', documentos: 10, ventas: 3500.00, porcentaje: 11 },
    { nombre: 'Soluciones JKL', documentos: 8, ventas: 1000.00, porcentaje: 3 },
  ],
  total: 31500.00,
};
