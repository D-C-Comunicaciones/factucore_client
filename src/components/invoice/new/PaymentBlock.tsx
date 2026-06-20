"use client";

import React, { useState } from "react";

const inputClass =
    "bg-white border border-foreground/20 rounded-lg h-9 px-3 text-sm text-foreground hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors";

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
        <input
            type="text"
            value={displayValue}
            onChange={handleChange}
            className={className}
        />
    );
}

export function PaymentBlock() {
    const [showPayment, setShowPayment] = useState<boolean>(false);
    const [paymentNumeration, setPaymentNumeration] = useState<string>("Recibo de caja");
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [paymentAccount, setPaymentAccount] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("Efectivo");
    const [paymentValue, setPaymentValue] = useState<number>(0);

    return (
        <div className="bg-white border border-border/50 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-base font-semibold text-foreground">Pago recibido</h3>
                    <p className="text-sm text-muted-foreground mt-1">Si te hicieron un pago asociado a esta venta puedes hacer aquí su registro.</p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowPayment((prev) => !prev)}
                    className="px-4 py-2 border border-primary text-primary bg-white rounded-md text-sm font-medium hover:bg-primary/5 transition-colors cursor-pointer"
                >
                    {showPayment ? "Quitar pago" : "+ Agregar pago"}
                </button>
            </div>

            <div
                className="grid transition-all duration-300 ease-in-out"
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
                        <div className="grid grid-cols-5 gap-4 px-4 py-4 bg-white">
                            <div>
                                <select
                                    value={paymentNumeration}
                                    onChange={(e) => setPaymentNumeration(e.target.value)}
                                    className={`${inputClass} w-full`}
                                >
                                    <option value="Recibo de caja">Recibo de caja</option>
                                </select>
                            </div>
                            <div>
                                <input
                                    type="date"
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    className={`${inputClass} w-full`}
                                />
                            </div>
                            <div>
                                <select
                                    value={paymentAccount}
                                    onChange={(e) => setPaymentAccount(e.target.value)}
                                    className={`${inputClass} w-full`}
                                >
                                    <option value=""></option>
                                    <option value="Tarjeta de crédito empresarial">Tarjeta de crédito empresarial</option>
                                    <option value="Caja general">Caja general</option>
                                    <option value="Caja chica">Caja chica</option>
                                    <option value="Banco 1">Banco 1</option>
                                </select>
                            </div>
                            <div>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className={`${inputClass} w-full`}
                                >
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Consignación">Consignación</option>
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                                    <option value="Tarjeta de débito">Tarjeta de débito</option>
                                </select>
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
