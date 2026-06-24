import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { filename: string } }): Promise<Metadata> {
  // En Next.js 15+ los params son una promesa en Server Components
  const resolvedParams = await params;
  const decodedFilename = decodeURIComponent(resolvedParams.filename || "Factura");
  
  return {
    title: decodedFilename,
  };
}

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
