"use client";
import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Activity, BarChart3, DollarSign, FileText, GripVertical, Package, PieChartIcon, RotateCcw, ShoppingCart, Trash2, TrendingUp, UserCheck, Users } from 'lucide-react';
import { toast } from 'sonner';

import { EmptyDashboardState } from '@/components/dashboard/EmptyDashboardState';

import { FlujoTransaccionesWidget } from '@/components/dashboard/widgets/FlujoTransaccionesWidget';
import { DistribucionGastosWidget } from '@/components/dashboard/widgets/DistribucionGastosWidget';
import { ProductosMasVendidosWidget } from '@/components/dashboard/widgets/ProductosMasVendidosWidget';
import { MejoresClientesWidget } from '@/components/dashboard/widgets/MejoresClientesWidget';
import { DeleteWidgetDialog } from '@/components/dashboard/DeleteWidgetDialog';
import {
  flujoTransaccionesMock,
  totalVentasMock,
  distribucionGastosMock,
  productosMasVendidosMock,
  mejoresClientesMock,
  cuentasPorCobrarMock,
  cuentasPorPagarMock,
  impuestosMock,
  productosVendidosMock,
  devolucionesMock,
  clientesConVentasMock,
} from '@/data/dashboardMockData';
import { TotalVentasWidget } from '@/components/dashboard/widgets/TotalVentasWidget';
import { CuentasPorCobrarWidget } from '@/components/dashboard/widgets/CuentasPorCobrarWidget';
import { CuentasPorPagarWidget } from '@/components/dashboard/widgets/CuentasPorPagarWidget';
import { ImpuestosWidget } from '@/components/dashboard/widgets/ImpuestosWidget';
import { ProductosVendidosSimpleWidget } from '@/components/dashboard/widgets/ProductosVendidosSimpleWidget';
import { DevolucionesWidget } from '@/components/dashboard/widgets/DevolucionesWidget';
import { ClientesConVentasWidget } from '@/components/dashboard/widgets/ClientesConVentasWidget';
import { WidgetSkeleton } from '@/components/dashboard/widgets/WidgetSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { AddGraphMenu } from '@/components/dashboard/AddGraphMenu';

interface Widget {
  id: string;
  type: 'cuentas-cobrar' | 'cuentas-pagar' | 'impuestos' | 'productos' | 'devoluciones' | 'clientes' | 'ventas' | 'flujo-transacciones' | 'distribucion-gastos' | 'productos-vendidos' | 'mejores-clientes';
  title: string;
  size?: 'small' | 'large' | 'medium' | 'half' | 'full';
}

interface SortableWidgetProps {
  widget: Widget;
  onRemove: (id: string) => void;
}

function SortableWidget({ widget, onRemove }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'cuentas-cobrar':
        return <CuentasPorCobrarWidget {...cuentasPorCobrarMock} />;

      case 'cuentas-pagar':
        return <CuentasPorPagarWidget {...cuentasPorPagarMock} />;

      case 'impuestos':
        return <ImpuestosWidget {...impuestosMock} />;

      case 'productos':
        return <ProductosVendidosSimpleWidget {...productosVendidosMock} />;

      case 'devoluciones':
        return <DevolucionesWidget {...devolucionesMock} />;

      case 'clientes':
        return <ClientesConVentasWidget {...clientesConVentasMock} />;

      case 'ventas':
        return <TotalVentasWidget {...totalVentasMock} />;

      case 'flujo-transacciones':
        return <FlujoTransaccionesWidget {...flujoTransaccionesMock} />;

      case 'distribucion-gastos':
        return <DistribucionGastosWidget {...distribucionGastosMock} />;

      case 'productos-vendidos':
        return <ProductosMasVendidosWidget {...productosMasVendidosMock} />;

      case 'mejores-clientes':
        return <MejoresClientesWidget {...mejoresClientesMock} />;

      default:
        return null;
    }
  };

  const getGridClass = () => {
    const size = widget.size || (widget.type === 'cuentas-cobrar' || widget.type === 'cuentas-pagar' ? 'large' : widget.type === 'ventas' ? 'full' : 'small');

    switch (size) {
      case 'large':
        return 'lg:row-span-2';
      case 'medium':
        return 'lg:col-span-2';
      case 'half':
        return 'lg:col-span-2';
      case 'full':
        return 'lg:col-span-4';
      default:
        return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border border-gray-200 p-4 relative group ${getGridClass()}`}
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>
        <button
          onClick={() => onRemove(widget.id)}
          className="p-1 hover:bg-red-100 rounded text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {renderWidgetContent()}
    </div>
  );
}

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [widgetToDelete, setWidgetToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Cargar widgets desde localStorage al montar el componente
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboard-widgets');
    if (savedWidgets) {
      try {
        setWidgets(JSON.parse(savedWidgets));
      } catch (error) {
        console.error('Error al cargar widgets guardados:', error);
        setDefaultWidgets();
      }
    } else {
      setDefaultWidgets();
    }
    setIsLoaded(true);
  }, []);

  // Simular carga de datos cuando cambia el mes
  useEffect(() => {
    if (isLoaded) {
      setIsLoadingData(true);
      // Simular una petición a la API
      const timer = setTimeout(() => {
        setIsLoadingData(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedMonth, isLoaded]);

  // Guardar widgets en localStorage cada vez que cambien
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
    }
  }, [widgets, isLoaded]);

  const setDefaultWidgets = () => {
    const defaultWidgets: Widget[] = [
      { id: '1', type: 'cuentas-cobrar', title: 'Cuentas por cobrar', size: 'large' },
      { id: '2', type: 'cuentas-pagar', title: 'Cuentas por pagar', size: 'large' },
      { id: '3', type: 'impuestos', title: 'Impuestos en venta', size: 'small' },
      { id: '4', type: 'productos', title: 'Productos vendidos', size: 'small' },
      { id: '5', type: 'devoluciones', title: 'Devoluciones de clientes', size: 'small' },
      { id: '6', type: 'clientes', title: 'Clientes con ventas', size: 'small' },
    ];
    setWidgets(defaultWidgets);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemoveWidget = (id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (widget) {
      setWidgetToDelete({ id: widget.id, title: widget.title });
    }
  };

  const confirmDelete = () => {
    if (widgetToDelete) {
      setWidgets((items) => items.filter((item) => item.id !== widgetToDelete.id));
      toast.info('Gráfica eliminada', {
        description: `Se eliminó "${widgetToDelete.title}" del dashboard`,
      });
      setWidgetToDelete(null);
    }
  };

  const graphOptions = [
    { type: 'cuentas-cobrar' as const, title: 'Cuentas por cobrar', size: 'large' as const, icon: FileText },
    { type: 'cuentas-pagar' as const, title: 'Cuentas por pagar', size: 'large' as const, icon: DollarSign },
    { type: 'impuestos' as const, title: 'Impuestos en venta', size: 'small' as const, icon: BarChart3 },
    { type: 'productos' as const, title: 'Productos vendidos', size: 'small' as const, icon: Package },
    { type: 'devoluciones' as const, title: 'Devoluciones de clientes', size: 'small' as const, icon: RotateCcw },
    { type: 'clientes' as const, title: 'Clientes con ventas', size: 'small' as const, icon: Users },
    { type: 'ventas' as const, title: 'Total de ventas', size: 'full' as const, icon: TrendingUp },
    { type: 'flujo-transacciones' as const, title: 'Flujo de transacciones', size: 'full' as const, icon: Activity },
    { type: 'distribucion-gastos' as const, title: 'Distribución de gastos', size: 'full' as const, icon: PieChartIcon },
    { type: 'productos-vendidos' as const, title: 'Productos más vendidos', size: 'half' as const, icon: ShoppingCart },
    { type: 'mejores-clientes' as const, title: 'Mejores clientes', size: 'half' as const, icon: UserCheck },
  ];

  const handleAddWidget = (option: { type: Widget['type']; title: string; size: Widget['size']; icon: React.ElementType }) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: option.type,
      title: option.title,
      size: option.size,
    };

    setWidgets((items) => {
      // Si es un widget predefinido, insertarlo en su posición original
      if (isPredefinedWidget(option.type)) {
        const targetPosition = PREDEFINED_POSITIONS[option.type];

        // Crear una copia del array actual
        const updatedWidgets = [...items];

        // Encontrar la posición de inserción correcta
        let insertIndex = 0;
        for (let i = 0; i < updatedWidgets.length; i++) {
          const currentWidget = updatedWidgets[i];
          if (isPredefinedWidget(currentWidget.type)) {
            const currentPosition = PREDEFINED_POSITIONS[currentWidget.type];
            if (currentPosition < targetPosition) {
              insertIndex = i + 1;
            }
          }
        }

        // Insertar el widget en la posición correcta
        updatedWidgets.splice(insertIndex, 0, newWidget);
        return updatedWidgets;
      }

      // Si no es predefinido, agregarlo al final
      return [...items, newWidget];
    });

    toast.success('Gráfica agregada con éxito', {
      description: `Se añadió "${option.title}" al dashboard`,
    });
  };

  const handleAddPredefinedWidgets = () => {
    const predefinedWidgets: Widget[] = [
      { id: Date.now().toString(), type: 'cuentas-cobrar', title: 'Cuentas por cobrar', size: 'large' },
      { id: (Date.now() + 1).toString(), type: 'cuentas-pagar', title: 'Cuentas por pagar', size: 'large' },
      { id: (Date.now() + 2).toString(), type: 'impuestos', title: 'Impuestos en venta', size: 'small' },
      { id: (Date.now() + 3).toString(), type: 'productos', title: 'Productos vendidos', size: 'small' },
      { id: (Date.now() + 4).toString(), type: 'devoluciones', title: 'Devoluciones de clientes', size: 'small' },
      { id: (Date.now() + 5).toString(), type: 'clientes', title: 'Clientes con ventas', size: 'small' },
      { id: (Date.now() + 6).toString(), type: 'ventas', title: 'Total de ventas', size: 'full' },
    ];
    setWidgets(predefinedWidgets);
    toast.success('Gráficas predefinidas agregadas', {
      description: 'Se añadieron todas las gráficas predeterminadas',
    });
  };

  const availableGraphOptions = graphOptions.filter(
    option => !widgets.some(w => w.type === option.type)
  );

  // Mostrar loading inicial mientras carga
  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-40 rounded-full" />
              <Skeleton className="h-10 w-40 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[minmax(90px,auto)]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <WidgetSkeleton key={i} size={i <= 2 ? 'large' : 'small'} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <h1 className="page-title mb-0">
            Resumen del negocio
          </h1>

          <div className="flex gap-3 flex-wrap">
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
            <AddGraphMenu
              onAddWidget={handleAddWidget}
              existingWidgetTypes={widgets.map(w => w.type)}
            />
          </div>
        </div>

        {/* CONTENT */}
        {widgets.length === 0 ? (
          <EmptyDashboardState onAddPredefinedWidgets={handleAddPredefinedWidgets} />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={widgets.map(w => w.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[minmax(90px,auto)]">
                {widgets.map((widget) => (
                  <SortableWidget
                    key={widget.id}
                    widget={widget}
                    onRemove={handleRemoveWidget}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <DeleteWidgetDialog
        isOpen={!!widgetToDelete}
        widgetTitle={widgetToDelete?.title || ''}
        onConfirm={confirmDelete}
        onCancel={() => setWidgetToDelete(null)}
      />
    </div>
  );
}

// Posiciones fijas para los widgets predefinidos
const PREDEFINED_POSITIONS = {
  'cuentas-cobrar': 0,
  'cuentas-pagar': 1,
  'impuestos': 2,
  'productos': 3,
  'devoluciones': 4,
  'clientes': 5,
} as const;

const isPredefinedWidget = (type: Widget['type']): type is keyof typeof PREDEFINED_POSITIONS => {
  return type in PREDEFINED_POSITIONS;
};
