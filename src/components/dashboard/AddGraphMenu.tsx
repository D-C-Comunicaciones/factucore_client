"use client";
import { useState } from 'react';
import { ChevronDown, FileText, DollarSign, BarChart3, Package, RotateCcw, Users, TrendingUp, Activity, PieChart as PieChartIcon, ShoppingCart, UserCheck } from 'lucide-react';

interface GraphOption {
  type: 'cuentas-cobrar' | 'cuentas-pagar' | 'impuestos' | 'productos' | 'devoluciones' | 'clientes' | 'ventas' | 'flujo-transacciones' | 'distribucion-gastos' | 'productos-vendidos' | 'mejores-clientes';
  title: string;
  size: 'small' | 'large' | 'medium' | 'half' | 'full';
  icon: React.ElementType;
}

interface AddGraphMenuProps {
  onAddWidget: (option: GraphOption) => void;
  existingWidgetTypes: string[];
}

const allGraphOptions: GraphOption[] = [
  { type: 'cuentas-cobrar', title: 'Cuentas por cobrar', size: 'large', icon: FileText },
  { type: 'cuentas-pagar', title: 'Cuentas por pagar', size: 'large', icon: DollarSign },
  { type: 'impuestos', title: 'Impuestos en venta', size: 'small', icon: BarChart3 },
  { type: 'productos', title: 'Productos vendidos', size: 'small', icon: Package },
  { type: 'devoluciones', title: 'Devoluciones de clientes', size: 'small', icon: RotateCcw },
  { type: 'clientes', title: 'Clientes con ventas', size: 'small', icon: Users },
  { type: 'ventas', title: 'Total de ventas', size: 'full', icon: TrendingUp },
  { type: 'flujo-transacciones', title: 'Flujo de transacciones', size: 'full', icon: Activity },
  { type: 'distribucion-gastos', title: 'Distribución de gastos', size: 'full', icon: PieChartIcon },
  { type: 'productos-vendidos', title: 'Productos más vendidos', size: 'half', icon: ShoppingCart },
  { type: 'mejores-clientes', title: 'Mejores clientes', size: 'half', icon: UserCheck },
];

export function AddGraphMenu({ onAddWidget, existingWidgetTypes }: AddGraphMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  const availableOptions = allGraphOptions.filter(
    option => !existingWidgetTypes.includes(option.type)
  );

  const handleAddWidget = (option: GraphOption) => {
    onAddWidget(option);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={availableOptions.length === 0}
        className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-full text-xs font-medium transition-colors flex items-center gap-2 min-w-[130px] justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Agregar gráfica</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {showMenu && availableOptions.length > 0 && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
          <div className="py-1">
            {availableOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleAddWidget(option)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                >
                  <IconComponent className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-900">{option.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
