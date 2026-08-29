"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const routeTitles: Record<string, string> = {
  "/login": "Iniciar sesión",
  "/dashboard": "Dashboard",
  "/sales/invoices": "Facturas de venta",
  "/sales/invoices/new": "Nueva factura",
  "/contacts": "Contactos",
  "/bandeja": "Bandeja de entrada",
  "/config": "Configuración",
};

export function DocumentTitleUpdater() {
  const pathname = usePathname();

  useEffect(() => {
    const pageTitle = routeTitles[pathname] || pathname.split("/").pop() || "Dashboard";
    document.title = pageTitle;
  }, [pathname]);

  return null;
}