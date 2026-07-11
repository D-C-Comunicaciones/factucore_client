"use client";

import React from "react";
import { ArrowLeft, Edit2, Mail, MoreVertical, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Minus, Trash2 } from "lucide-react";

interface PaymentDetailHeaderProps {
  paymentNumber: string;
}

export function PaymentDetailHeader({ paymentNumber }: PaymentDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col mb-6">
      <button
        onClick={() => router.push("/payments")}
        className="flex items-center text-primary text-sm font-medium hover:underline mb-4 w-fit"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Volver a mis pagos recibidos
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">
          Pago recibido No. {paymentNumber}
        </h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary data-[state=open]:border-primary data-[state=open]:ring-1 data-[state=open]:ring-primary cursor-pointer transition-colors">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer text-slate-700">
                <Minus className="w-4 h-4 mr-2" />
                Anular
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" className="h-9 w-9 bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors">
            <Mail className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors">
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="h-9 bg-white text-slate-700 font-medium border-slate-200 hover:bg-slate-50 hover:text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors">
            <Edit2 className="w-4 h-4 mr-2" />
            Editar pago
          </Button>
        </div>
      </div>
    </div>
  );
}
