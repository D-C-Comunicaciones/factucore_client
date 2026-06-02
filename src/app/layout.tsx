import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { CustomToaster } from '@/components/sonner/CustomToaster'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from "@/components/ui/theme-provider"

// 🔥 IMPORTA TU PROVIDER
import { Providers } from '@/providers'

export const metadata: Metadata = {
    title: 'Factucore Software de Facturación',
    description: 'Software de facturación electrónica para Colombia',
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
        <html lang="es" suppressHydrationWarning>
            <head>
                <style>{`
                    html {
                        font-family: ${GeistSans.style.fontFamily};
                        --font-sans: ${GeistSans.variable};
                        --font-mono: ${GeistMono.variable};
                    }
                `}</style>
            </head>
            <body suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Providers>
                        <AuthProvider>
                            {children}
                        </AuthProvider>

                        <CustomToaster />
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    )
}