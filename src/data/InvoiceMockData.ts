import { FileText, Bell, TrendingUp } from 'lucide-react';

export interface InvoiceStats {
  icon: React.ElementType;
  label: string;
  value: number;
  iconBgColor: string;
  iconColor: string;
}

export const invoiceStatsMock: InvoiceStats[] = [
  {
    icon: FileText,
    label: 'Sin emisión',
    value: 12,
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    icon: Bell,
    label: 'Sin envío al cliente',
    value: 5,
    iconBgColor: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    icon: TrendingUp,
    label: 'En proceso',
    value: 8,
    iconBgColor: 'bg-teal-100',
    iconColor: 'text-teal-600'
  }
];

export interface Invoice {
  id: string;
  numero: string;
  cliente: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  total: number;
  porCobrar: number;
  estadoDian: 'aprobada' | 'rechazada' | 'pendiente';
  estado: 'cobrada' | 'parcial' | 'pendiente' | 'vencida';
}

export const invoicesMock: Invoice[] = [
  {
    id: '1',
    numero: 'LTCH1',
    cliente: 'Consumidor Final',
    fechaCreacion: '27/01/2025',
    fechaVencimiento: '27/01/2025',
    total: 840,
    porCobrar: 0,
    estadoDian: 'aprobada',
    estado: 'cobrada'
  },
  {
    id: '2',
    numero: 'LTCH2',
    cliente: 'Empresa ABC S.A.S',
    fechaCreacion: '26/01/2025',
    fechaVencimiento: '10/02/2025',
    total: 1500,
    porCobrar: 1500,
    estadoDian: 'aprobada',
    estado: 'pendiente'
  },
  {
    id: '3',
    numero: 'LTCH3',
    cliente: 'Comercial XYZ Ltda',
    fechaCreacion: '25/01/2025',
    fechaVencimiento: '20/01/2025',
    total: 2300,
    porCobrar: 2300,
    estadoDian: 'aprobada',
    estado: 'vencida'
  }
];
