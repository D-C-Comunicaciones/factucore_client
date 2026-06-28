import { useEffect, useState } from "react";
import { AuthService } from "@/lib/auth";
import Image from "next/image";

export function CompanySummaryCard() {
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    setCompany(AuthService.getCompany<any>());
  }, []);

  const companyName = company?.company_name || "NO PROPORCIONADO";
  const nit = company
    ? `${company.identification_number}${company.verification_digit != null ? `-${company.verification_digit}` : ""}`
    : "1143263398-4";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 w-full">

      {/* Empresa */}
      <div className="flex flex-col items-center text-center flex-1 min-w-0">
        <span className="text-muted-foreground text-xs font-medium uppercase mb-2">Empresa</span>
        <span className="text-foreground text-sm font-semibold w-full break-words">
          {companyName}
        </span>
      </div>

      <div className="hidden md:block w-px h-12 bg-gray-200"></div>

      {/* Identificación */}
      <div className="flex flex-col items-center text-center flex-1 min-w-0">
        <span className="text-muted-foreground text-xs font-medium uppercase mb-2">Identificación (NIT)</span>
        <span className="text-foreground text-sm font-semibold truncate w-full">
          {nit}
        </span>
      </div>

      <div className="hidden md:block w-px h-12 bg-gray-200"></div>

      {/* Logo Factucore */}
      <div className="flex flex-col items-center justify-center flex-1 min-w-0">
        <Image
          src="/img/factucore_logo_horizontal.webp"
          alt="Factucore Logo"
          width={220}
          height={60}
          className="object-contain"
        />
      </div>

      <div className="hidden md:block w-px h-12 bg-gray-200"></div>

      {/* Versión */}
      <div className="flex flex-col items-center text-center flex-1 min-w-0">
        <span className="text-muted-foreground text-xs font-medium uppercase mb-2">Versión de Factucore</span>
        <span className="text-foreground text-sm font-semibold truncate w-full">
          Colombia
        </span>
      </div>

      <div className="hidden md:block w-px h-12 bg-gray-200"></div>

      {/* Plan Actual */}
      <div className="flex flex-col items-center text-center flex-1 min-w-0">
        <span className="text-muted-foreground text-xs font-medium uppercase mb-2">Plan Actual</span>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-1.5 px-6 rounded transition-colors w-full max-w-[140px]">
          ILIMITADO
        </button>
      </div>

    </div>
  );
}
