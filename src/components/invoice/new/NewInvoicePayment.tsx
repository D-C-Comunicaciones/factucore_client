"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { useResolutions } from "@/hooks/useResolutions";

const inputClass =
    "flex h-9 w-full rounded-md border border-foreground/20 bg-white px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-primary focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50";

function FormattedInput({ value, onChange, className }: any) {
    const [displayValue, setDisplayValue] = React.useState(value ? new Intl.NumberFormat('es-CO').format(value) : "");

    React.useEffect(() => {
        const numericDisplay = parseFloat(displayValue.replace(/\./g, "").replace(/,/g, ".")) || 0;
        if (value !== numericDisplay && value !== undefined) {
            setDisplayValue(value ? new Intl.NumberFormat('es-CO').format(value) : "");
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (!raw) {
            setDisplayValue("");
            onChange(0);
            return;
        }
        const num = parseFloat(raw);
        setDisplayValue(new Intl.NumberFormat('es-CO').format(num));
        onChange(num);
    };

    return (
        <Input
            type="text"
            value={displayValue}
            onChange={handleChange}
            className={className}
        />
    );
}

export function NewInvoicePayment({ 
    paymentMethods, 
    bankAccounts,
    paymentData,
    onPaymentDataChange
}: { 
    paymentMethods?: any[], 
    bankAccounts?: any[],
    paymentData?: any,
    onPaymentDataChange?: (data: any) => void
}) {
    const { resolutions: receiptResolutions } = useResolutions({ type_resolution: 5, is_active: true });

    const [showPayment, setShowPayment] = useState<boolean>(false);
    const [paymentNumeration, setPaymentNumeration] = useState<string>("");
    const [paymentDate, setPaymentDate] = useState<Date>(new Date());
    const [paymentAccount, setPaymentAccount] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("Efectivo");
    const [paymentValue, setPaymentValue] = useState<number>(0);

    React.useEffect(() => {
        if (receiptResolutions && receiptResolutions.length > 0 && !paymentNumeration) {
            setPaymentNumeration(receiptResolutions[0].id.toString());
        }
    }, [receiptResolutions, paymentNumeration]);

    React.useEffect(() => {
        if (onPaymentDataChange) {
            if (showPayment) {
                onPaymentDataChange({
                    payment_method_id: paymentMethod ? parseInt(paymentMethod) : null,
                    resolution_id: paymentNumeration ? parseInt(paymentNumeration) : null,
                    account_id: paymentAccount ? parseInt(paymentAccount) : null,
                    payment_date: paymentDate ? paymentDate.toISOString().split('T')[0] : null,
                    amount: paymentValue || 0
                });
            } else {
                onPaymentDataChange(null);
            }
        }
    }, [showPayment, paymentMethod, paymentNumeration, paymentAccount, paymentDate, paymentValue]);

    return (
        <div className="bg-white rounded-lg border border-border p-6 mb-8">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">
                        Pago recibido
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Si te hicieron un pago asociado a esta venta puedes hacer aquí su registro.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowPayment((prev) => !prev)}
                    className={
                        showPayment
                            ? "px-4 py-2 border border-primary text-primary bg-white rounded-md text-sm font-medium hover:bg-primary/5 transition-colors cursor-pointer"
                            : "text-primary font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary/80 transition-colors"
                    }
                >
                    {!showPayment && <Plus className="w-4 h-4" />}
                    {showPayment ? "Quitar pago" : "Agregar pago"}
                </button>
            </div>

            <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${!showPayment ? 'pointer-events-none' : ''}`}
                style={{
                    gridTemplateRows: showPayment ? '1fr' : '0fr',
                    opacity: showPayment ? 1 : 0,
                    marginTop: showPayment ? '1.5rem' : '0'
                }}
            >
                <div className="min-h-0">
                    <div className="border border-border/50 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-5 gap-4 bg-[#f8fafc] px-4 py-3 border-b border-border/50">
                            <span className="text-[13px] font-semibold text-slate-700">Numeración</span>
                            <span className="text-[13px] font-semibold text-slate-700">Fecha</span>
                            <span className="text-[13px] font-semibold text-slate-700">Cuenta bancaria</span>
                            <span className="text-[13px] font-semibold text-slate-700">Método de pago</span>
                            <span className="text-[13px] font-semibold text-slate-700">Valor</span>
                        </div>
                        <div className="grid grid-cols-5 gap-4 px-4 py-4 bg-white items-center">
                            <div>
                                <SearchableSelect
                                    value={paymentNumeration}
                                    onValueChange={setPaymentNumeration}
                                    options={receiptResolutions?.map((r: any) => ({
                                        value: r.id.toString(),
                                        label: r.name || "Recibo de caja"
                                    })) || []}
                                    className="w-full"
                                    placeholder="Seleccionar"
                                />
                            </div>
                            <div>
                                <DatePickerSimple value={paymentDate} onChange={setPaymentDate} />
                            </div>
                            <div>
                                <SearchableSelect
                                    value={paymentAccount}
                                    onValueChange={setPaymentAccount}
                                    options={bankAccounts || []}
                                    className="w-full"
                                    placeholder="Seleccionar"
                                />
                            </div>
                            <div>
                                <SearchableSelect
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                    options={paymentMethods || []}
                                    className="w-full"
                                    placeholder="Seleccionar"
                                />
                            </div>
                            <div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                    <FormattedInput
                                        value={paymentValue}
                                        onChange={setPaymentValue}
                                        className={`${inputClass} w-full pl-6`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}