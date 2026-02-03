import React from 'react';
import { BarChart3, Settings, UserCircle, Lock, Activity, LogOut, ChevronRight } from 'lucide-react';

interface UserMenuProps {
  onClose: () => void;
}

export function UserMenu({ onClose }: UserMenuProps) {
  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="font-semibold text-gray-900">Andrés Leones</div>
        <div className="text-sm text-gray-600">leones1997@live.com</div>
        <div className="mt-2 inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
          Identificación: 1143263398
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center justify-between px-3 py-2 mb-1">
          <span className="text-sm font-medium text-gray-700">Facturación electrónica</span>
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            Activo
          </span>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <BarChart3 className="w-4 h-4" />
          <span className="flex-1 text-left">Consumo del plan</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          <span className="flex-1 text-left">Configuración</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <UserCircle className="w-4 h-4" />
          <span className="flex-1 text-left">Mi perfil</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Lock className="w-4 h-4" />
          <span className="flex-1 text-left">Seguridad</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Activity className="w-4 h-4" />
          <span className="flex-1 text-left">Estado de las soluciones</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="p-2 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="flex-1 text-left">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
