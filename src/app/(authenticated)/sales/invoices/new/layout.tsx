import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nueva Factura',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
