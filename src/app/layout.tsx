import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/auth-context'

export const metadata: Metadata = {
    title: 'Facturación Consola - D&C IDEM COMUNICACIONES S.A.S.',
    description: 'Created by D&C IDEM COMUNICACIONES S.A.S.',
    generator: 'D&C IDEM COMUNICACIONES S.A.S.',
    icons: {
        icon: [
            { url: '/img/favicon.ico' },
            { url: '/img/favicon.ico', sizes: '16x16' },
            { url: '/img/favicon.ico', sizes: '32x32' },
        ],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es">
            <head>
                <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
            </head>
            <body>
                <AuthProvider>
                    {children}
                    <Toaster />
                </AuthProvider>
            </body>
        </html>
    )
}
