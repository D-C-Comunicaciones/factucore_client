"use client";

import * as React from "react";
import type { ItemResponse } from "@/types/items";

interface ItemPriceListsProps {
    item: ItemResponse;
    formatMoney: (val: number | undefined | null) => string;
}

export function ItemPriceLists({ item, formatMoney }: ItemPriceListsProps) {
    const totalPrice = item.pricing?.total_price ?? 0;

    return (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
            <p className="text-[17px] font-bold text-slate-800 mb-6">Listas de precios</p>
            {item.pricing?.price_lists?.length ? (
                <div className="space-y-2">
                    {item.pricing.price_lists.map((pl, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            <span className="text-[15px] font-medium text-slate-700">General</span>
                            <span className="text-[15px] font-bold text-primary">
                                {formatMoney(pl.value ?? totalPrice)}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-[15px] font-medium text-slate-700">General</span>
                    <span className="text-[15px] font-bold text-primary">{formatMoney(totalPrice)}</span>
                </div>
            )}
        </div>
    );
}