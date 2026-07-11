"use client";

import React, { useState } from "react";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";

interface ContactDetailCommentsProps {
    contact: any;
}

export function ContactDetailComments({ contact }: ContactDetailCommentsProps) {
    // Assuming contact might have comments, or we just hold them in local state for now
    const [comments, setComments] = useState<any[]>(contact.comments || []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <CommentsAndReminders comments={comments} setComments={setComments} />
        </div>
    );
}
