"use client";

import { useState } from "react";
import { Settings, HelpCircle, X, Plus, Info, ChevronDown } from "lucide-react";
import { InvoiceItemsTable } from "./new/InvoiceItemsTable";

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
    { id: 1, item: "", referencia: "", precio: "", descuento: "", impuesto: "", descripcion: "", cantidad: 0, total: 0 },
  ]);

  const [showEmitirMenu, setShowEmitirMenu] = useState(false);

  const handleAddItem = () => {
    setinvoiceItems([
      ...invoiceItems,
      {
        id: invoiceItems.length + 1,
        item: "",
        referencia: "",
        precio: "",
        descuento: "",
        impuesto: "",
        descripcion: "",
        cantidad: 0,
        total: 0,
      },
    ]);
  };

  const inputClass =
    "w-full h-[42px] px-3 py-2 rounded-lg text-sm border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40";

  const buttonSecondary =
    "px-4 py-2 rounded-lg text-sm font-medium border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors";

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Nueva factura de venta electrónica
        </h1>

        <button className={`${buttonSecondary} flex items-center gap-2`}>
          <Settings className="w-4 h-4" />
          Personalizar opciones
        </button>
      </div>

      {/* FORM SUPERIOR */}
      <div className="bg-background border border-border rounded-lg p-6 grid grid-cols-6 gap-4">

        <div className="col-span-2">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Tipo de documento
          </label>

          <div className="flex gap-2">
            <button className="flex-1 h-[42px] bg-primary text-primary-foreground rounded-lg text-sm font-medium">
              Factura de venta
            </button>
            {/*
                        <button className={`flex-1 h-[42px] ${buttonSecondary}`}>
                          Tiquete
                        </button>
                        */}
          </div>
        </div>

        <select className={inputClass}>
          <option>Principal</option>
        </select>

        <select className={inputClass}>
          <option>General</option>
        </select>

        <input className={inputClass} placeholder="Buscar vendedor..." />
        <input className={inputClass} placeholder="Orden compra" />
        <input className={inputClass} placeholder="Orden entrega" />
      </div>

      {/* FACTURA */}
      <div className="bg-background border border-border rounded-lg p-8 space-y-6">

        {/* HEADER FACTURA */}
        <div className="flex justify-between items-start">

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
            Logo
          </div>

          <div className="text-center">
            <h2 className="font-bold text-lg text-foreground">
              TU EMPRESA
            </h2>
            <p className="text-sm text-muted-foreground">NIT</p>
          </div>

          <div className="text-right">
            <span className="text-sm text-muted-foreground">No.</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-foreground">
                0001
              </span>

              <button className="p-1 rounded hover:bg-primary/10 transition-colors">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* CLIENTE */}
        <div className="grid grid-cols-2 gap-4">
          <input className={inputClass} placeholder="Documento" />
          <input className={inputClass} type="date" />

          <input className={inputClass} placeholder="Cliente" />
          <select className={inputClass}>
            <option>Forma de pago</option>
          </select>

          <input className={inputClass} placeholder="Correo" />
          <select className={inputClass}>
            <option>Medio de pago</option>
          </select>
        </div>

        {/* BOTON */}
        <button className="text-primary text-sm font-medium flex items-center gap-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo contacto
        </button>

        {/* ITEMS */}
        {/* <InvoiceItemsTable items={invoiceItems} onAddItem={handleAddItem} /> */}

        {/* FOOTER IZQ */}
        <div className="grid grid-cols-2 gap-6">

          <div className="space-y-4">

            <button className="text-primary text-sm font-medium flex items-center gap-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-colors">
              <Plus className="w-4 h-4" />
              Agregar remisión
            </button>

            <textarea className={`${inputClass} h-24`} placeholder="Términos..." />
            <textarea className={`${inputClass} h-20`} placeholder="Notas..." />

            <div className="bg-muted/40 p-4 rounded-lg text-sm text-muted-foreground">
              Pie de factura
            </div>
          </div>

          {/* TOTALES */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>$0</span>
            </div>

            <div className="flex justify-between text-sm text-destructive">
              <span>Descuento</span>
              <span>$0</span>
            </div>

            <div className="border-t border-border pt-2 flex justify-between font-bold text-lg text-foreground">
              <span>Total</span>
              <span>$0</span>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER BOTONES */}
      <div className="bg-background border border-border rounded-lg p-6 flex justify-center gap-3">

        <button
          onClick={() => onNavigate("facturas-venta")}
          className={buttonSecondary}
        >
          Cancelar
        </button>

        <button className={buttonSecondary}>Vista previa</button>

        <button className={buttonSecondary}>
          Emitir y crear nueva
        </button>

        <div className="relative">
          <button
            onClick={() => setShowEmitirMenu(!showEmitirMenu)}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            Emitir
          </button>

          {showEmitirMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-primary/10 hover:text-primary transition-colors">
                Guardar como borrador
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-primary/10 hover:text-primary transition-colors">
                Emitir e imprimir
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ALERT */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 flex gap-4">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <Info className="w-5 h-5 text-primary-foreground" />
        </div>

        <p className="text-sm text-muted-foreground">
          Guarda primero para poder agregar comentarios.
        </p>
      </div>
    </div>
  );
}