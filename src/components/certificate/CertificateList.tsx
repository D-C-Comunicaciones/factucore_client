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

  if (!certificate) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-8 text-center text-gray-500">
        No tienes ningún certificado digital configurado.
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
        </TableBody>
      </Table>
    </div>
  );
}
