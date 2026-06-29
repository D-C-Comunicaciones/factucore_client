"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { InvoicesService } from "@/lib/invoices";
import { Loader2 } from "lucide-react";

function PrintPdfContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  
  // Safe extraction for Next.js 15 dynamic params in client components
  const filename = typeof params?.filename === 'string' ? params.filename : "documento.pdf";
  const urlInvoiceId = searchParams.get("invoiceId");
  
  const [status, setStatus] = useState<string>("Iniciando...");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set document title so printing works correctly
    document.title = decodeURIComponent(filename);

    // Intentar leer de sessionStorage primero, si no, del URL (por si recarga la página)
    let invoiceId = urlInvoiceId || sessionStorage.getItem(`print_invoice_${filename}`);
    
    // Limpiar la URL si tiene parámetros de consulta para que se vea perfectamente limpia
    if (urlInvoiceId && window.history.replaceState) {
      window.history.replaceState(null, "", `/print/${filename}`);
    }

    if (!invoiceId) {
      setError("No se proporcionó el ID de la factura.");
      return;
    }

    const loadPdf = async () => {
      try {
        setStatus("Descargando archivo...");
        const rawBlob = await InvoicesService.downloadPdfBlob(invoiceId, 1);
        setStatus("Procesando documento...");
        const fileName = decodeURIComponent(filename);
        const file = new File([rawBlob], fileName, { type: "application/pdf" });
        // Ocultar el toolbar nativo porque su botón de descarga siempre usa el UUID del blob
        const url = window.URL.createObjectURL(file) + "#toolbar=0&zoom=100";
        setPdfUrl(url);
      } catch (err: any) {
        console.error("Error cargando PDF:", err);
        setError(err?.message || "Error al cargar el documento.");
      }
    };

    loadPdf();

    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [urlInvoiceId, filename]);

  if (error) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-50 text-red-500 font-medium p-4">
        <p className="text-lg mb-2">Error</p>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-white text-gray-600 font-sans p-4">
        <Loader2 className="animate-spin text-primary mb-4 w-10 h-10" />
        <span className="text-base font-medium">{status}</span>
      </div>
    );
  }

  const decodedFilename = decodeURIComponent(filename);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden m-0 p-0 bg-gray-100">
      {/* Barra superior personalizada para descarga y título */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
        <h1 className="text-sm font-semibold text-gray-800 truncate pr-4">
          {decodedFilename}
        </h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
              iframe?.contentWindow?.print();
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir
          </button>
          <a 
            href={pdfUrl} 
            download={decodedFilename}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Descargar PDF
          </a>
        </div>
      </div>
      
      {/* Visor de PDF */}
      <div className="flex-1 w-full relative">
        <iframe 
          id="pdf-iframe"
          src={pdfUrl} 
          className="w-full h-full border-none absolute inset-0" 
          title={decodedFilename} 
        />
      </div>
    </div>
  );
}

export default function PrintPdfPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-screen w-full items-center justify-center bg-white text-gray-600 font-sans">
        <Loader2 className="animate-spin text-primary mb-2 w-8 h-8" />
        <span className="text-sm">Preparando documento...</span>
      </div>
    }>
      <PrintPdfContent />
    </Suspense>
  );
}
