"use client";
import React from 'react';

interface DeleteWidgetDialogProps {
  isOpen: boolean;
  widgetTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteWidgetDialog({ isOpen, widgetTitle, onConfirm, onCancel }: DeleteWidgetDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar gráfica</h3>
        <p className="text-sm text-gray-600 mb-6">
          Al confirmar, se eliminará la gráfica <span className="font-semibold">"{widgetTitle}"</span> de tu resumen.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Conservar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
