import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facturas de venta',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
