"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { BillDetailHeader } from "@/components/bills/details/BillDetailHeader";
import { BillDetailSummary } from "@/components/bills/details/BillDetailSummary";
import { BillDetailDocument } from "@/components/bills/details/BillDetailDocument";
import { BillDetailTabs } from "@/components/bills/details/BillDetailTabs";
import { BillDetailSkeleton } from "@/components/bills/details/BillDetailSkeleton";
import { useBill } from "@/hooks/bills/useBills";
import { AuthService } from "@/lib/auth";

export default function BillDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = params?.id as string;
    const initialTab = searchParams?.get("tab") || undefined;

    const { data, isLoading, isError } = useBill(id);
    const bill: any = data?.bill || null;

    useEffect(() => {
        if (bill) {
            document.title = `Factura de compra ${bill.bill_number || `#${bill.id}`}`;
        }
    }, [bill]);

    if (isLoading) {
        return <BillDetailSkeleton />;
    }

    if (isError || !bill) {
        return <div className="py-10 text-center text-red-500">No se pudo cargar la factura de compra</div>;
    }

    const company = AuthService.getCompany<any>();

    const statusCode = String(bill.bill_status?.code || "").toUpperCase();
    const canEdit = statusCode !== "PAGADO" && statusCode !== "ANULADO";
    const canCancel = statusCode !== "PAGADO" && statusCode !== "ANULADO";

    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4 space-y-6 text-sm text-slate-700 relative">
            <BillDetailHeader bill={bill} canEdit={canEdit} canCancel={canCancel} />

            <BillDetailSummary bill={bill} />

            <BillDetailDocument bill={bill} company={company} />

            <BillDetailTabs bill={bill} initialTab={initialTab} />
        </div>
    );
}
