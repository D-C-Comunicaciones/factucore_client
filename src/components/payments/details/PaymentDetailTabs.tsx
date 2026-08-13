"use client";

import React, { useState } from "react";
import { PaymentDetailAccountingAccounts } from "./PaymentDetailAccountingAccounts";
import { PaymentDetailAdvances } from "./PaymentDetailAdvances";
import { PaymentDetailAccounting } from "./PaymentDetailAccounting";

interface PaymentDetailTabsProps {
  payment: any;
}

export function PaymentDetailTabs({ payment }: PaymentDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"accounts" | "advances" | "accounting">("accounts");

  const tabs = [
    { id: "accounts", label: "Estado de cuenta" },
    { id: "advances", label: "Anticipos" },
    { id: "accounting", label: "Contabilidad" },
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-4 overflow-hidden">
      <div className="flex items-center gap-6 px-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-slate-800"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-0">
        {activeTab === "accounts" && <PaymentDetailAccountingAccounts invoice={payment.invoice} />}
        {activeTab === "advances" && <PaymentDetailAdvances />}
        {activeTab === "accounting" && <PaymentDetailAccounting />}
      </div>
    </div>
  );
}
