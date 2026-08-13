"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { usePayment } from "@/hooks/payments/usePayment";
import { PaymentDetailHeader } from "@/components/payments/details/PaymentDetailHeader";
import { PaymentDetailTotal } from "@/components/payments/details/PaymentDetailTotal";
import { PaymentDetailInfo } from "@/components/payments/details/PaymentDetailInfo";
import { PaymentDetailAttachments } from "@/components/payments/details/PaymentDetailAttachments";
import { PaymentDetailTabs } from "@/components/payments/details/PaymentDetailTabs";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: payment, isLoading, error } = usePayment(id);
  const [comments, setComments] = useState<any[]>([]);

  // Update comments state when payment data loads if it contains comments
  React.useEffect(() => {
    if (payment?.comments) {
      setComments(payment.comments);
    }
  }, [payment]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 space-y-6">
        <div className="flex flex-col space-y-4 mb-6">
          <Skeleton className="h-4 w-48" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p className="mb-4">Error al cargar el pago o el pago no existe.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <PaymentDetailHeader paymentNumber={payment.full_number || payment.id?.toString()} />

      <PaymentDetailTotal amount={payment.amount || 0} />

      <PaymentDetailInfo
        status={payment.payment_status}
        customerName={payment.customer}
        customerId={payment.contact_id || payment.customer_id}
        creationDate={payment.created_at}
        paymentMethod={payment.payment_method}
        bankAccount={payment.account_name}
        notes={payment.notes}
      />

      {payment.attachments && payment.attachments.length > 0 && (
        <PaymentDetailAttachments attachments={payment.attachments} />
      )}

      <PaymentDetailTabs payment={payment} />

      <CommentsAndReminders 
        comments={comments} 
        setComments={setComments} 
      />
    </div>
  );
}
