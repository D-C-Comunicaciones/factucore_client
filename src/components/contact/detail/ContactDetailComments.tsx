"use client";

import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import type { Contact } from "@/types/contact";

interface ContactDetailCommentsProps {
    contact: Contact;
}

export function ContactDetailComments({ contact }: ContactDetailCommentsProps) {
    return <CommentsAndReminders type="contact" commentableId={contact.id} />;
}
