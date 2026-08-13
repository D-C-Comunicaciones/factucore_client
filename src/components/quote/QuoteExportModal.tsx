"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from "date-fns";

export interface QuoteExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: { rangeType: string; fromDate?: Date; toDate?: Date; isAll?: boolean }) => void;
}

export function QuoteExportModal({ isOpen, onClose, onExport }: QuoteExportModalProps) {
  const [rangeType, setRangeType] = useState<string>("manual");
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const now = new Date();
    switch (rangeType) {
      case "present":
      case "today":
        setFromDate(startOfDay(now));
        setToDate(endOfDay(now));
        break;
      case "this_week":
        setFromDate(startOfWeek(now, { weekStartsOn: 1 }));
        setToDate(endOfWeek(now, { weekStartsOn: 1 }));
        break;
      case "this_month":
        setFromDate(startOfMonth(now));
        setToDate(endOfMonth(now));
        break;
      case "this_year":
        setFromDate(startOfYear(now));
        setToDate(endOfYear(now));
        break;
      case "past":
        setFromDate(undefined);
        setToDate(endOfDay(subDays(now, 1)));
        break;
      case "manual":
      default:
        break;
    }
  }, [rangeType]);

  const handleExport = () => {
    onExport({ rangeType, fromDate, toDate, isAll: false });
    onClose();
  };

  const handleExportAll = () => {
    onExport({ rangeType: "all", isAll: true });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px] bg-white"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-primary font-normal text-lg">Exportar cotizaciones</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={rangeType} onValueChange={setRangeType}>
            <SelectTrigger className="bg-white border-gray-300 cursor-pointer hover:border-primary transition-colors">
              <SelectValue placeholder="Seleccione un rango" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual" className="cursor-pointer rounded-lg data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary my-0.5">Manual</SelectItem>
              <SelectItem value="present" className="cursor-pointer rounded-lg data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary my-0.5">Presente</SelectItem>
              <SelectItem value="today" className="cursor-pointer rounded-lg data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary my-0.5">Hoy</SelectItem>
              <SelectItem value="this_week" className="cursor-pointer rounded-lg data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary my-0.5">Esta semana</SelectItem>
              <SelectItem value="this_month" className="cursor-pointer rounded-lg data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary my-0.5">Este mes</SelectItem>
              <SelectItem value="this_year" className="cursor-pointer rounded-lg data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary my-0.5">Este año</SelectItem>
              <SelectItem value="past" className="cursor-pointer rounded-lg data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary my-0.5">Pasado</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-[80px_1fr] items-center gap-4 mt-2">
            <span className="text-sm font-semibold text-slate-700 text-right">
              Desde <span className="text-primary">*</span>
            </span>
            <DatePickerSimple 
                value={fromDate} 
                onChange={(d) => {
                    setFromDate(d);
                    setRangeType("manual");
                }} 
            />
          </div>
          <div className="grid grid-cols-[80px_1fr] items-center gap-4">
            <span className="text-sm font-semibold text-slate-700 text-right">
              Hasta <span className="text-primary">*</span>
            </span>
            <DatePickerSimple 
                value={toDate} 
                onChange={(d) => {
                    setToDate(d);
                    setRangeType("manual");
                }} 
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2 sm:justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={handleExportAll} 
            className="w-full sm:w-auto font-medium text-slate-700 bg-white border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            Exportar todo
          </Button>
          <Button onClick={handleExport} className="w-full sm:w-auto font-medium cursor-pointer">
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
