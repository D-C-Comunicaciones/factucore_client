"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useContactForm } from "./ContactFormProvider";
import { useSellersList } from "@/hooks/sellers/useSellers";
import { NewSellerModal } from "@/components/seller/NewSellerModal";
import { NewPriceListModal } from "@/components/price-list/NewPriceListModal";
import { NewPaymentTermModal } from "@/components/payment-terms/NewPaymentTermModal";

interface ContactCommercialInfoProps {
  catalogData: any;
}

export function ContactCommercialInfo({ catalogData }: ContactCommercialInfoProps) {
  const [expanded, setExpanded] = useState(true);
  const { paymentTermId, setPaymentTermId, priceListId, setPriceListId, sellerId, setSellerId } = useContactForm();

  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isPriceListModalOpen, setIsPriceListModalOpen] = useState(false);
  const [isPaymentTermModalOpen, setIsPaymentTermModalOpen] = useState(false);

  const { data: sellersData, isLoading: isLoadingSellers } = useSellersList({
    params: { per_page: 1000 },
  });

  const sellers = sellersData?.data?.map((seller: any) => ({
    value: seller.id.toString(),
    label: seller.name,
  })) || [];

  const priceLists = catalogData?.priceLists?.map((pl: any) => ({
    value: pl.id.toString(),
    label: pl.name,
  })) || [];

  const paymentTerms = catalogData?.paymentTerms?.map((pt: any) => ({
    value: pt.id.toString(),
    label: pt.name,
  })) || [];

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
      >
        <div>
          <span className="text-sm font-semibold text-slate-800">Información comercial</span>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Agrega los datos administrativos y condiciones comerciales</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 transition-transform duration-300" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-300" />}
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <TooltipProvider>
          <div className="p-5 border-t border-gray-100 space-y-4 bg-white">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                Plazo de pago
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-white border-slate-800">
                    Define cuánto tiempo tendrá tu cliente para pagar sus compras a crédito.
                  </TooltipContent>
                </Tooltip>
              </label>
              <SearchableSelect
                value={paymentTermId}
                onValueChange={setPaymentTermId}
                options={paymentTerms}
                placeholder="Seleccionar plazo"
                className="w-full text-foreground border-gray-300"
                footer={
                  <div className="p-2 border-t border-gray-100 bg-white">
                    <button
                      type="button"
                      onClick={() => setIsPaymentTermModalOpen(true)}
                      className="w-full text-left px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                    >
                      Nuevo plazo
                    </button>
                  </div>
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  Lista de precios
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white border-slate-800">
                      Selecciona la lista de precios que deseas asociar a este contacto. Ver más
                    </TooltipContent>
                  </Tooltip>
                </label>
                <SearchableSelect
                  value={priceListId}
                  onValueChange={setPriceListId}
                  options={priceLists}
                  placeholder="Seleccionar lista"
                  className="w-full text-foreground border-gray-300"
                  footer={
                    <div className="p-2 border-t border-gray-100 bg-white">
                      <button
                        type="button"
                        onClick={() => setIsPriceListModalOpen(true)}
                        className="w-full text-left px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                      >
                        Nueva lista de precios
                      </button>
                    </div>
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  Vendedor
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white border-slate-800">
                      Selecciona el vendedor que deseas asociar a este contacto. Ver más
                    </TooltipContent>
                  </Tooltip>
                </label>
                <SearchableSelect
                  value={sellerId}
                  onValueChange={setSellerId}
                  options={sellers}
                  placeholder="Seleccionar vendedor"
                  className="w-full text-foreground border-gray-300"
                  footer={
                    <div className="p-2 border-t border-gray-100 bg-white">
                      <button
                        type="button"
                        onClick={() => setIsSellerModalOpen(true)}
                        className="w-full text-left px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                      >
                        Nuevo vendedor
                      </button>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
          </TooltipProvider>
        </div>
      </div>

      <NewSellerModal
        open={isSellerModalOpen}
        onOpenChange={setIsSellerModalOpen}
        onSave={(data) => setSellerId(String(data.id))}
      />

      <NewPriceListModal
        open={isPriceListModalOpen}
        onOpenChange={setIsPriceListModalOpen}
        onSave={(data: any) => setPriceListId(String(data.id))}
      />

      <NewPaymentTermModal
        open={isPaymentTermModalOpen}
        onOpenChange={setIsPaymentTermModalOpen}
        onSave={(data) => setPaymentTermId(String(data.id))}
      />
    </div>
  );
}
