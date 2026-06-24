"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CertificateListProps {
  certificate: any | null;
  loading: boolean;
}

export function CertificateList({ certificate, loading }: CertificateListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Asunto (CN)</TableHead>
              <TableHead>Emisor</TableHead>
              <TableHead>Válido Desde</TableHead>
              <TableHead>Válido Hasta</TableHead>
              <TableHead>Días Restantes</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
              <TableCell><Skeleton className="h-6 w-[60px] rounded-full" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Asunto (CN)</TableHead>
            <TableHead>Emisor</TableHead>
            <TableHead>Válido Desde</TableHead>
            <TableHead>Válido Hasta</TableHead>
            <TableHead>Días Restantes</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!certificate ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="h-64 bg-white text-center align-middle">
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    className="mb-4 text-gray-300"
                  >
                    <rect x="8" y="10" width="32" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                    <rect x="14" y="18" width="20" height="2" rx="1" fill="currentColor" />
                    <rect x="14" y="24" width="12" height="2" rx="1" fill="currentColor" />
                  </svg>
                  <div className="text-lg font-semibold text-gray-700">Sin resultados</div>
                  <div className="text-sm text-gray-500 mt-1">
                    No tiene certificado digital configurado
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell className="font-medium text-primary">
                {certificate.subject?.CN || certificate.name}
              </TableCell>
              <TableCell>{certificate.issuer?.CN || '-'}</TableCell>
              <TableCell>{certificate.valid_from}</TableCell>
              <TableCell>{certificate.valid_to}</TableCell>
              <TableCell>{certificate.days_remaining} días</TableCell>
              <TableCell>
                {certificate.is_active ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none font-medium">Activo</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none shadow-none font-medium">Inactivo</Badge>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
