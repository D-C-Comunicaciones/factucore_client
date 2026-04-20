export const envs = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Facturación Consola',
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    testUserEmail: process.env.NEXT_PUBLIC_TEST_USER_EMAIL || '',
    testUserPassword: process.env.NEXT_PUBLIC_TEST_USER_PASSWORD || '',
} as const

// Validate required environment variables
export function validateEnv() {
    if (!envs.apiUrl) {
        throw new Error('Missing required environment variable: NEXT_PUBLIC_API_URL')
    }
}
