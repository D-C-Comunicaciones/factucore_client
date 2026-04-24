"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Users, Check, ChevronsUpDown } from 'lucide-react';
import { Logo } from '../logos/Logo';

export function WorkspaceSelector() {
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const workspaceBtnRef = useRef<HTMLButtonElement>(null);

  // Cierra el dropdown si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        workspaceBtnRef.current &&
        !workspaceBtnRef.current.contains(event.target as Node)
      ) {
        setShowWorkspaceDropdown(false);
      }
    }
    if (showWorkspaceDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWorkspaceDropdown]);

  return (
    <div className="w-full relative px-1">
      <button
        ref={workspaceBtnRef}
        className={`
          flex items-center gap-2 bg-white rounded-lg px-2 py-1 mt-2 w-full border border-gray-200
          hover:border-primary/40 transition
          ${showWorkspaceDropdown ? 'ring-2 ring-ring/40 border-primary/40' : ''}
        `}
        style={{ maxWidth: '100%', width: '100%' }}
        onClick={() => setShowWorkspaceDropdown((v) => !v)}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={showWorkspaceDropdown}
      >
        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
          <Logo className="h-3.5" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="font-semibold text-[11px] leading-tight truncate">Dc Contabilidad</div>
          <div className="text-[9px] text-gray-500 truncate">Andrés Leones</div>
        </div>
        <ChevronsUpDown className="w-3 h-3 text-gray-400" />
      </button>

      {/* Dropdown: abre a la derecha */}
      {showWorkspaceDropdown && (
        <div
          className="absolute left-full top-0 ml-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
          tabIndex={-1}
        >
          <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">
            Tus espacios de trabajo
          </div>
          <div className="px-4 pb-2 text-xs text-gray-400 truncate">
            LEONES PALACIO AND...
          </div>
          <ul className="py-1">
            <li>
              <button
                className="flex items-center w-full px-4 py-2 gap-2 rounded-lg bg-primary/10 text-primary font-semibold"
                tabIndex={0}
              >
                <span className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Logo className="h-4" />
                </span>
                <span className="flex-1 text-left">
                  Alegra Contabilidad
                  <div className="text-xs font-normal text-gray-500 leading-tight">
                    Facturación, reportes, ingresos y más.
                  </div>
                </span>
                <Check className="w-4 h-4 text-primary" />
              </button>
            </li>
            <li>
              <button
                className="flex items-center w-full px-4 py-2 gap-2 rounded-lg hover:bg-gray-100 text-gray-900"
                tabIndex={0}
              >
                <span className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </span>
                <span className="flex-1 text-left">
                  Espacio Contador
                  <div className="text-xs font-normal text-gray-500 leading-tight">
                    Gestión de múltiples clientes.
                  </div>
                </span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
