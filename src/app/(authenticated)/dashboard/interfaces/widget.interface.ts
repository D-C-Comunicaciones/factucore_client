export interface Widget {
  id: string;
  type: 'cuentas-cobrar' | 'cuentas-pagar' | 'impuestos' | 'productos' | 'devoluciones' | 'clientes' | 'ventas' | 'flujo-transacciones' | 'distribucion-gastos' | 'productos-vendidos' | 'mejores-clientes';
  title: string;
  size?: 'small' | 'large' | 'medium' | 'half' | 'full';
}

export interface SortableWidgetProps {
  widget: Widget;
  onRemove: (id: string) => void;
}