import React, { useState } from 'react';
import { BarChart3, Settings, UserCircle, Lock, Activity, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface UserMenuProps {
  onClose: () => void;
}

export function UserMenu({ onClose }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [imgError, setImgError] = useState(false);

  const name = user?.name || "Usuario";
  const email = user?.email || "";

  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-200 flex flex-col items-center text-center">

        {/* AVATAR */}
        {!imgError ? (
          <img
            src="/img/avatars/afleones.jpeg"
            alt="avatar"
            onError={() => setImgError(true)}
            className="w-16 h-16 rounded-full object-cover mb-2 border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold mb-2">
            {initials}
          </div>
        )}

        {/* INFO DINÁMICA */}
        <div className="font-semibold text-gray-900">
          {name}
        </div>

        <div className="text-sm text-gray-600">
          {email}
        </div>

        <div className="mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/20">
          ID: {user?.id || "-"}
        </div>
      </div>

      {/* SECCIÓN */}
      <div className="p-2">
        <div className="flex items-center justify-between px-3 py-2 mb-1">
          <span className="text-sm font-medium text-gray-700">
            Facturación electrónica
          </span>

          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            Activo
          </span>
        </div>

        {/* ITEMS */}
        <button className="w-full flex items-center gap-3 px-3 h-9 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
          <BarChart3 className="w-4 h-4" />
          <span className="flex-1 text-left">Consumo del plan</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button className="w-full flex items-center gap-3 px-3 h-9 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
          <Settings className="w-4 h-4" />
          <span className="flex-1 text-left">Configuración</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button className="w-full flex items-center gap-3 px-3 h-9 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
          <UserCircle className="w-4 h-4" />
          <span className="flex-1 text-left">Mi perfil</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button className="w-full flex items-center gap-3 px-3 h-9 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
          <Lock className="w-4 h-4" />
          <span className="flex-1 text-left">Seguridad</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button className="w-full flex items-center gap-3 px-3 h-9 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
          <Activity className="w-4 h-4" />
          <span className="flex-1 text-left">Estado de las soluciones</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* FOOTER */}
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="w-full flex items-center gap-3 px-3 h-9 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span className="flex-1 text-left">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}