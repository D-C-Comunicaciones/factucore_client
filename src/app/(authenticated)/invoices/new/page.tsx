"use client";
import { NewInvoiceView } from "@/components/invoice/NewInvoiceView";

export default function NuevaFacturaPage() {
  return (
    <div className="w-full min-h-screen text-xs">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8">
        <NewInvoiceView onNavigate={() => {}} />
      </div>
    </div>
  );
}
