"use client";

import * as React from "react";
import type { ItemResponse } from "@/types/items";

interface ItemPriceListsProps {
    item: ItemResponse;
    formatMoney: (val: number | undefined | null) => string;
}

export function ItemPriceLists({ item, formatMoney }: ItemPriceListsProps) {
    const totalPrice = parseFloat(item.pricing?.total_price ?? "0");

    const priceLists = item.pricing?.price_lists?.length
        ? item.pricing.price_lists
        : [{ value: item.pricing?.total_price ?? "0", price_list: { name: "General" } }];

    return (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm self-start">
            <div className="border-b border-slate-200/60">
                <p className="px-6 pt-6 pb-3 text-[17px] font-bold text-slate-800">Listas de precios</p>
            </div>
            <div className="overflow-y-auto px-2 pb-4" style={{ maxHeight: "260px" }}>
                {priceLists.map((pl, idx) => {
                    const val = pl.value ? parseFloat(pl.value) : totalPrice;
                    const name = pl.price_list?.name ?? "General";
                    return (
                        <div
                            key={idx}
                            className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <span className="text-[15px] font-medium text-slate-700">{name}</span>
                            <span className="text-[15px] font-bold text-primary">
                                {formatMoney(val)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}