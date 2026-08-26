"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useSellersList } from "@/hooks/sellers/useSellers";
import { ContactsService } from "@/lib/contacts";
import { showToast } from "@/components/sonner/CustomToaster";

interface BulkEditContactsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contactIds: number[];
    onDone: () => void;
}

// Edición masiva: solo campos comerciales que tiene sentido igualar entre
// varios contactos a la vez (Vendedor, Plazo de pago, Lista de precios,
// Enviar estado de cuenta) — nunca identidad (nombre, identificación, email,
// dirección), que es propia de cada contacto. Cada campo tiene su propio
// checkbox: solo se aplica lo que el usuario marcó explícitamente, el resto
// de cada contacto queda intacto (PATCH parcial por contacto).
export function BulkEditContactsModal({ open, onOpenChange, contactIds, onDone }: BulkEditContactsModalProps) {
    const catalogData = useCatalogs();
    const { data: sellersData } = useSellersList({ params: { per_page: 1000 } });

    const [applySeller, setApplySeller] = useState(false);
    const [sellerId, setSellerId] = useState("");
    const [applyPaymentTerm, setApplyPaymentTerm] = useState(false);
    const [paymentTermId, setPaymentTermId] = useState("");
    const [applyPriceList, setApplyPriceList] = useState(false);
    const [priceListId, setPriceListId] = useState("");
    const [applySendStatement, setApplySendStatement] = useState(false);
    const [sendAccountStatement, setSendAccountStatement] = useState(false);

    const [saving, setSaving] = useState(false);

    const sellers = sellersData?.data?.map((seller: any) => ({
        value: seller.id.toString(),
        label: seller.name,
    })) || [];
    const priceLists = catalogData?.priceLists?.map((pl: any) => ({
        value: pl.id.toString(),
        label: pl.name,
    })) || [];
    const paymentTerms = catalogData?.paymentTerms?.map((pt: any) => ({
        value: pt.id.toString(),
        label: pt.name,
    })) || [];

    const nothingSelected = !applySeller && !applyPaymentTerm && !applyPriceList && !applySendStatement;

    const resetForm = () => {
        setApplySeller(false);
        setSellerId("");
        setApplyPaymentTerm(false);
        setPaymentTermId("");
        setApplyPriceList(false);
        setPriceListId("");
        setApplySendStatement(false);
        setSendAccountStatement(false);
    };

    const handleSave = async () => {
        if (nothingSelected) {
            showToast("Selecciona al menos un campo para aplicar", "warning");
            return;
        }

        const payload: Record<string, any> = {};
        if (applySeller) payload.seller_id = sellerId ? Number(sellerId) : null;
        if (applyPaymentTerm) payload.payment_term_id = paymentTermId ? Number(paymentTermId) : null;
        if (applyPriceList) payload.price_list_id = priceListId ? Number(priceListId) : null;
        if (applySendStatement) payload.send_account_statement = sendAccountStatement;

        setSaving(true);
        try {
            const results = await Promise.allSettled(
                contactIds.map((id) => ContactsService.update(id, payload))
            );
            const failed = results.filter((r) => r.status === "rejected").length;
            const succeeded = results.length - failed;

            if (succeeded > 0) {
                showToast(`${succeeded} contacto${succeeded > 1 ? "s" : ""} actualizado${succeeded > 1 ? "s" : ""} correctamente`, "success");
            }
            if (failed > 0) {
                showToast(`No se pudieron actualizar ${failed} contacto${failed > 1 ? "s" : ""}`, "error");
            }

            resetForm();
            onOpenChange(false);
            onDone();
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
            <DialogContent className="bg-white max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar {contactIds.length} contacto{contactIds.length > 1 ? "s" : ""}</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground -mt-2">
                    Marca los campos que quieres cambiar en todos los contactos seleccionados. Los campos sin marcar no se modifican.
                </p>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                            <Checkbox checked={applySeller} onCheckedChange={(v) => setApplySeller(v === true)} />
                            Vendedor
                        </label>
                        <SearchableSelect
                            value={sellerId}
                            onValueChange={setSellerId}
                            options={sellers}
                            placeholder="Seleccionar vendedor"
                            searchPlaceholder="Buscar vendedor..."
                            disabled={!applySeller}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                            <Checkbox checked={applyPaymentTerm} onCheckedChange={(v) => setApplyPaymentTerm(v === true)} />
                            Plazo de pago
                        </label>
                        <SearchableSelect
                            value={paymentTermId}
                            onValueChange={setPaymentTermId}
                            options={paymentTerms}
                            placeholder="Seleccionar plazo de pago"
                            searchPlaceholder="Buscar plazo de pago..."
                            disabled={!applyPaymentTerm}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                            <Checkbox checked={applyPriceList} onCheckedChange={(v) => setApplyPriceList(v === true)} />
                            Lista de precios
                        </label>
                        <SearchableSelect
                            value={priceListId}
                            onValueChange={setPriceListId}
                            options={priceLists}
                            placeholder="Seleccionar lista de precios"
                            searchPlaceholder="Buscar lista de precios..."
                            disabled={!applyPriceList}
                        />
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                            <Checkbox checked={applySendStatement} onCheckedChange={(v) => setApplySendStatement(v === true)} />
                            Enviar estado de cuenta
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                                type="checkbox"
                                checked={sendAccountStatement}
                                disabled={!applySendStatement}
                                onChange={(e) => setSendAccountStatement(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-disabled:opacity-50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving} className="cursor-pointer">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={saving || nothingSelected} className="cursor-pointer">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplicar cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
