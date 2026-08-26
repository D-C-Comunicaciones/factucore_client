import React, { useState } from "react";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";

export function PaymentTabs() {
  const [comments, setComments] = useState<any[]>([]);

  return (
    <div className="mt-8">
      <CommentsAndReminders
        comments={comments}
        setComments={setComments}
        requiresSaveFirst={true}
      />
    </div>
  );
}
