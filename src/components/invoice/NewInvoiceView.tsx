import { useState } from 'react';
import { Settings, HelpCircle, X, Plus, Info, ChevronDown } from 'lucide-react';
import { InvoiceItemsTable } from './new/InvoiceItemsTable';

interface NewInvoiceViewProps {
  onNavigate: (view: string) => void;
}

interface InvoiceItem {
  id: number;
  item: string;
  referencia: string;
  precio: string;
  descuento: string;
  impuesto: string;
  descripcion: string;
  cantidad: number;
  total: number;
}

export function NewInvoicePage({ onNavigate }: NewInvoiceViewProps) {
  const [invoiceItems, setinvoiceItems] = useState<InvoiceItem[]>([
    { id: 1, item: '', referencia: '', precio: '', descuento: '', impuesto: '', descripcion: '', cantidad: 0, total: 0 },
    { id: 2, item: '', referencia: '', precio: '', descuento: '', impuesto: '', descripcion: '', cantidad: 0, total: 0 },
    { id: 3, item: '', referencia: '', precio: '', descuento: '', impuesto: '', descripcion: '', cantidad: 0, total: 0 }
  ]);
  const [showEmitirMenu, setShowEmitirMenu] = useState(false);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: invoiceItems.length + 1,
      item: '',
      referencia: '',
      precio: '',
      descuento: '',
      impuesto: '',
      descripcion: '',
      cantidad: 0,
      total: 0
    };
    setinvoiceItems([...invoiceItems, newItem]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nueva factura de venta electrónica</h1>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            Personalizar opciones
          </button>
        </div>
      </div>

      {/* Tipo de documento y opciones */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de documento
            </label>
            <div className="flex gap-2">
              <button className="flex-1 h-[42px] px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                Factura de venta
              </button>
              <button className="flex-1 h-[42px] px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm">
                Tiquete
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bodega
            </label>
            <select className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">
              <option>Principal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              Lista de precios
              <HelpCircle className="w-3 h-3 text-gray-400" />
            </label>
            <select className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">
              <option>General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              Vendedor
              <HelpCircle className="w-3 h-3 text-gray-400" />
            </label>
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              Orden de compra
              <HelpCircle className="w-3 h-3 text-gray-400" />
            </label>
            <input
              type="text"
              className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              Orden de entrega
              <HelpCircle className="w-3 h-3 text-gray-400" />
            </label>
            <input
              type="text"
              className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
            />
          </div>
        </div>
      </div>

      {/* Factura principal */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Header de la factura */}
        <div className="flex items-start justify-between mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-400 font-medium mb-1">Utilizar mi logo</div>
            <div className="text-xs text-gray-400">176 × 51 pixeles</div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              LEONES PALACIO ANDRES FELIPE
            </h2>
            <div className="text-sm text-gray-600">NIT: 1143263398</div>
            <div className="text-sm text-gray-600">leones1997@live.com</div>
          </div>

          <div className="text-right">
            <div className="mb-2">
              <select className="text-sm border-0 text-gray-600 focus:outline-none focus:ring-0">
                <option>Factura electrónica</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">No.</span>
              <span className="font-bold text-lg">LTCH-2</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documento <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">
                <option>CC</option>
                <option>NIT</option>
                <option>CE</option>
              </select>
              <input
                type="text"
                placeholder="Buscar Nº de ID"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                defaultValue="2026-01-07"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4 text-gray-400" />
              </button>
              <button className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded">
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre o razón social <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Seleccionar cliente"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma de pago <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">
              <option>Contado</option>
              <option>Crédito</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medio de pago <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">
              <option>Seleccionar</option>
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Tarjeta</option>
            </select>
          </div>
        </div>

        <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 mb-6">
          <Plus className="w-4 h-4" />
          Nuevo contacto
        </button>

        {/* Tabla de items */}
        <InvoiceItemsTable items={invoiceItems} onAddItem={handleAddItem} />

        {/* Sección inferior */}
        <div className="grid grid-cols-2 gap-8">
          {/* Izquierda - Firma y términos */}
          <div className="space-y-6">
            <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Agregar remisión
              <HelpCircle className="w-3 h-3 text-gray-400" />
            </button>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-gray-400 font-medium mb-1">Utilizar mi firma</div>
              <div className="text-xs text-gray-400">176 × 51 pixeles</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                Términos y condiciones
                <HelpCircle className="w-3 h-3 text-gray-400" />
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                defaultValue="Esta factura se asimila en todos sus efectos a una letra de cambio de conformidad con el Art. 774 del código de comercio. Autorizo que en caso de incumplimiento de esta obligación sea reportado a las centrales de riesgo, se cobrarán intereses por mora..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                Notas
                <HelpCircle className="w-3 h-3 text-gray-400" />
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Pie de factura</div>
              <div className="text-xs text-gray-500">
                Autorización de numeración de facturación Nº18764087804091 de 2025-01-27 Modalidad Factura Electrónica Desde Nº LTCH1 hasta LTCH100 con vigencia hasta 2027-01-27
              </div>
            </div>
          </div>

          {/* Derecha - Totales */}
          <div className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">$ 0</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Descuento</span>
                <span className="font-medium text-red-600">-$ 0</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold">$ 0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pago recibido */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Pago recibido</h3>
            <p className="text-sm text-gray-600">
              Si te hicieron un pago asociado a esta venta puedes hacer aquí su registro.
            </p>
          </div>
          <button className="text-primary hover:text-primary/80 font-medium flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Agregar pago
          </button>
        </div>
      </div>

      {/* Mensaje informativo */}
      <div className="bg-primary/10 rounded-lg border border-primary/20 p-6 flex items-start gap-4">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm text-gray-700">
          Guarda primero para poder agregar comentarios.
        </p>
      </div>

      {/* Footer con botones */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-xs text-gray-500 mb-4">
          Los campos marcados con <span className="text-red-500">*</span> son obligatorios
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('facturas-venta')}
            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            Vista previa
          </button>
          <button className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            Emitir y crear nueva
          </button>
          <div className="relative">
            <button
              onClick={() => setShowEmitirMenu(!showEmitirMenu)}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Emitir
              <ChevronDown className="w-4 h-4" />
            </button>
            {showEmitirMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                  Guardar como borrador
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                  Emitir e imprimir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}