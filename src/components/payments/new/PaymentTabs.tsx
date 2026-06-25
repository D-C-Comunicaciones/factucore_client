import React, { useState } from "react";
import { NewInvoiceComments } from "@/components/invoice/new/NewInvoiceComments";

export function PaymentTabs() {
  const [comments, setComments] = useState<any[]>([]);

  return (
    <div className="mt-8 -mb-8">
      <NewInvoiceComments 
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
}
