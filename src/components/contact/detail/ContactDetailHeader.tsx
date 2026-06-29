import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactDetailHeaderProps {
    contact: any;
    onBack?: () => void;
}

export function ContactDetailHeader({ contact, onBack }: ContactDetailHeaderProps) {
    const name = contact.registration_name || contact.name || contact.names || contact.company || "Detalle de contacto";
    const isActive = contact.status === "active" || contact.is_active || true; // Adjust based on real data

    const defaultBtnClass = "h-9 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-colors shadow-sm font-medium";

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(value || 0).replace("COP", "$").trim();
    };

    return (
        <div className="mb-8">
            <h1 className="text-[22px] font-bold text-slate-800 mb-6">{name}</h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <div className="flex items-center gap-2 mr-2">
                    <span className="text-sm font-medium text-slate-700">Activado</span>
                    <Switch checked={isActive} className="data-[state=checked]:bg-primary" />
                </div>

                <Button variant="outline" size="sm" className={defaultBtnClass}>
                    + Nueva factura
                </Button>
                <Button variant="outline" size="sm" className={defaultBtnClass}>
                    + Nueva factura de compra
                </Button>
                <Button variant="outline" size="sm" className={defaultBtnClass}>
                    <Edit className="w-4 h-4 mr-2" /> Editar
                </Button>
                <Button variant="outline" size="sm" className={defaultBtnClass}>
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={defaultBtnClass}>
                            Portal de clientes <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuItem className="cursor-pointer py-2">
                            Generar enlace de Portal de Clientes
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer py-2">
                            Enviar por correo
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={defaultBtnClass}>
                            Más acciones <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem className="cursor-pointer py-2">
                            Adjuntar archivo
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer py-2">
                            Ver estado de cuenta
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-r border-slate-100 last:border-r-0 flex flex-col justify-between">
                    <h3 className="text-[11px] font-semibold text-slate-400 mb-4">Cuentas por cobrar</h3>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(contact.accounts_receivable || 5000)}</p>
                </div>
                <div className="p-4 border-r border-slate-100 last:border-r-0 flex flex-col justify-between">
                    <h3 className="text-[11px] font-semibold text-slate-400 mb-4">Anticipos recibidos</h3>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(contact.advances_received || 0)}</p>
                </div>
                <div className="p-4 border-r border-slate-100 last:border-r-0 flex flex-col justify-between">
                    <h3 className="text-[11px] font-semibold text-slate-400 mb-4">Anticipos entregados</h3>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(contact.advances_given || 0)}</p>
                </div>
                <div className="p-4 border-r border-slate-100 last:border-r-0 flex flex-col justify-between">
                    <h3 className="text-[11px] font-semibold text-slate-400 mb-4">Por pagar</h3>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(contact.accounts_payable || 0)}</p>
                </div>
                <div className="p-4 border-r border-slate-100 last:border-r-0 flex flex-col justify-between">
                    <h3 className="text-[11px] font-semibold text-slate-400 mb-4">Notas crédito por aplicar</h3>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(contact.credit_notes_pending || 0)}</p>
                </div>
                <div className="p-4 border-r border-slate-100 last:border-r-0 flex flex-col justify-between">
                    <h3 className="text-[11px] font-semibold text-slate-400 mb-4">Notas débito por aplicar</h3>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(contact.debit_notes_pending || 0)}</p>
                </div>
            </div>
        </div>
    );
}
