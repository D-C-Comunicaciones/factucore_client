export const envs = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Facturación Consola',
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    testUserEmail: process.env.NEXT_PUBLIC_TEST_USER_EMAIL || '',
    testUserPassword: process.env.NEXT_PUBLIC_TEST_USER_PASSWORD || '',
    defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'COP',
    reverbAppKey: process.env.NEXT_PUBLIC_REVERB_APP_KEY || '',
    reverbHost: process.env.NEXT_PUBLIC_REVERB_HOST || '',
    // En producción (Railway) Reverb va detrás de TLS en 443; en desarrollo local
    // corre en texto plano en el puerto propio del contenedor "websockets" (8081,
    // ver docker-compose.yml) — sin esto, echo.ts forzaba wss://host:443 siempre y
    // la conexión local nunca llegaba a establecerse.
    reverbPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || '443'),
    reverbScheme: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'https') as 'http' | 'https',
} as const

// Validate required environment variables
export function validateEnv() {
    if (!envs.apiUrl) {
        throw new Error('Missing required environment variable: NEXT_PUBLIC_API_URL')
    }
}
