"use client";
import { BarChart3 } from 'lucide-react';

interface EmptyDashboardStateProps {
  onAddPredefinedWidgets: () => void;
}

export function EmptyDashboardState({ onAddPredefinedWidgets }: EmptyDashboardStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 mb-6 text-gray-300">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Resumen sin gráficas</h3>
      <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
        Las gráficas te permiten ver y analizar de forma inteligente los datos clave de tu negocio.
      </p>
      <button
        onClick={onAddPredefinedWidgets}
        className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Agregar gráficas predefinidas
      </button>
    </div>
  );
}
