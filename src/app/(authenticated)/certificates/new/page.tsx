"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewCertificateForm } from "@/components/certificate/NewCertificateForm";

export default function NewCertificatePage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        
        {/* HEADER */}
        <div className="mb-6 flex flex-col items-start gap-4">
          <Button
            variant="ghost"
            className="pl-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
            onClick={() => router.push('/certificates')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a certificados
          </Button>
          
          <div>
            <h1 className="page-title mb-0 text-2xl font-bold text-[#123159]">Nuevo Certificado Digital</h1>
            <p className="page-subtitle mt-1 text-sm text-gray-500">
              Sube tu certificado .p12 o pega su contenido en base64 para activar la facturación electrónica.
            </p>
          </div>
        </div>

        {/* FORM */}
        <NewCertificateForm />
        
      </div>
    </div>
  );
}
