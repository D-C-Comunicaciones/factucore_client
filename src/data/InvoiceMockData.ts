import { X, MessageCircle, Clock } from 'lucide-react';

export interface InvoiceStats {
  icon: React.ElementType;
  label: string;
  value: number;
  iconBgColor: string;
  iconColor: string;
}

export const invoiceStatsMock: InvoiceStats[] = [
  {
    icon: X,
    label: 'Sin emisión',
    value: 12,
    iconBgColor: '',
    iconColor: ''
  },
  {
    icon: MessageCircle,
    label: 'Sin envío al cliente',
    value: 5,
    iconBgColor: '',
    iconColor: ''
  },
  {
    icon: Clock,
    label: 'En proceso',
    value: 8,
    iconBgColor: '',
    iconColor: ''
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
