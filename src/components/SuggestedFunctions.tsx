import React from 'react';
import { FileText } from 'lucide-react';

export function SuggestedFunctions() {
  const suggestedFunctions = [
    { label: 'Saldos iniciales', completed: false },
    { label: 'Parámetros contables', completed: false },
    { label: 'Sincronizar documentos desde la DIAN', completed: false },
    { label: 'Facturación electrónica', completed: true },
    { label: 'Espacio Contador', completed: false },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Funciones sugeridas</h2>
          <p className="text-sm text-gray-600">Basados en tus necesidades, hemos preparado estas funciones ideales para ti.</p>
        </div>
        <button className="text-sm text-gray-500 hover:text-gray-700">Ocultar</button>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-ring/10 rounded-lg p-6 flex items-start gap-6">
        <div className="flex-1">
          <div className="space-y-3 mb-4">
            {suggestedFunctions.map((func, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${func.completed ? 'bg-primary border-primary' : 'border-gray-300'
                  }`}>
                  {func.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${func.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                  {func.label}
                </span>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500">1 de 5 funcionalidades completadas</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm min-w-[300px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Registra los saldos iniciales</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Configura tus saldos iniciales y empieza a gestionar tu contabilidad de forma ordenada.
          </p>
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            Registrar saldos
            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
