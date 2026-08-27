"use client";

import { useRouter } from "next/navigation";
import { AvatarInitials, ContactActionsCell, type Contact } from "@/components/contact/table/columns";
import { SelectRowCheckbox } from "@/components/ui/selection-checkbox";

interface ContactMobileCardProps {
  contact: Contact;
  selected: boolean;
  onToggleSelection: () => void;
  activeTab: "all" | "customer" | "provider";
  onDelete: (id: number) => void;
  onToggleActive: (id: number, currentlyActive: boolean) => void;
}

export function ContactMobileCard({
  contact,
  selected,
  onToggleSelection,
  activeTab,
  onDelete,
  onToggleActive,
}: ContactMobileCardProps) {
  const router = useRouter();
  const showCustomer = contact.type === "customer" || contact.type === "both";
  const showProvider = contact.type === "provider" || contact.type === "both";

  return (
    <div
      className={`flex items-start gap-3 border-b border-border p-4 ${selected ? "bg-primary/5" : "bg-white"}`}
      onClick={() => router.push(`/contacts/${contact.id}`)}
    >
      <div className="pt-0.5" onClick={(e) => e.stopPropagation()} data-no-row-select="true">
        <SelectRowCheckbox checked={selected} onToggle={onToggleSelection} />
      </div>

      <AvatarInitials name={contact.name} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-foreground truncate">{contact.name}</span>
          <div onClick={(e) => e.stopPropagation()} className="-mr-2 -mt-1 shrink-0">
            <ContactActionsCell contact={contact} onDelete={onDelete} onToggleActive={onToggleActive} />
          </div>
        </div>

        <div className="mt-0.5 text-xs text-muted-foreground">{contact.identification}</div>
        {contact.phone && <div className="text-xs text-muted-foreground">{contact.phone}</div>}

        <div className="mt-2 flex gap-1 flex-wrap">
          {showCustomer && (activeTab === "all" || activeTab === "customer") && (
            <span className="inline-flex px-2 py-0.5 text-[10px] rounded-full font-medium bg-primary/10 text-primary uppercase">
              Cliente
            </span>
          )}
          {showProvider && (activeTab === "all" || activeTab === "provider") && (
            <span className="inline-flex px-2 py-0.5 text-[10px] rounded-full font-medium bg-secondary/20 text-foreground uppercase">
              Proveedor
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
