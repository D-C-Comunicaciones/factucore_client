"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, Loader2 } from "lucide-react";
import { InvoicesService } from "@/lib/invoices";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any; // payload built by invoiceBuilder
}

export function PreviewModal({
  open,
  onOpenChange,
  data,
}: PreviewModalProps) {
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    const loadPdf = async () => {
      if (!open || !data) return;
      
      setLoading(true);
      try {
        const blob = await InvoicesService.preflight(data);
        if (active) {
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        }
      } catch (error) {
        console.error("Error al cargar la vista previa:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (open) {
      loadPdf();
    } else {
      // Cleanup
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    }

    return () => {
      active = false;
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data]);

  const handlePrint = () => {
    const iframe = document.getElementById("pdf-iframe") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `Borrador_Factura.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-gray-50/50">
        <DialogHeader className="px-6 py-4 border-b bg-white shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-800">Vista previa - Factura de venta</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex justify-center bg-gray-200">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Generando vista previa...</p>
            </div>
          ) : pdfUrl ? (
            <iframe 
              id="pdf-iframe"
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
              className="w-full h-full border-none shadow-inner"
              title="Vista previa del PDF"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-500">
              No se pudo generar la vista previa.
            </div>
          )}
        </div>

        {/* BARRA DE BOTONES FIJA AL FONDO */}
        <div className="px-6 py-4 border-t bg-white flex items-center justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={handlePrint} disabled={!pdfUrl || loading} className="gap-2">
            <Printer className="w-4 h-4" /> Imprimir
          </Button>
          <Button variant="outline" onClick={handleDownload} disabled={!pdfUrl || loading} className="gap-2">
            <Download className="w-4 h-4" /> Descargar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
