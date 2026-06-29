import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nuevo pago',
};

export default function NewPaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
