import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { envs } from "@/config/env";
import { getSession } from "@/common/interfaces/session";

// Cliente WebSocket real (Laravel Reverb, protocolo compatible con Pusher).
// No es polling: se abre una conexión persistente y los eventos llegan
// apenas ocurren. Ver comments-notifications.md para el detalle del backend.

type ReverbEcho = Echo<"reverb">;

let echoInstance: ReverbEcho | null = null;

export function getEcho(): ReverbEcho | null {
    if (typeof window === "undefined") return null;
    if (echoInstance) return echoInstance;

    // Sin las variables de Reverb configuradas (NEXT_PUBLIC_REVERB_APP_KEY /
    // NEXT_PUBLIC_REVERB_HOST) no hay servidor al que conectarse todavía —
    // se omite la conexión en vez de fallar en tiempo de ejecución.
    if (!envs.reverbAppKey || !envs.reverbHost) return null;

    (window as any).Pusher = Pusher;

    const forceTLS = envs.reverbScheme === "https";

    echoInstance = new Echo({
        broadcaster: "reverb",
        key: envs.reverbAppKey,
        wsHost: envs.reverbHost,
        wsPort: envs.reverbPort,
        wssPort: envs.reverbPort,
        forceTLS,
        enabledTransports: forceTLS ? ["ws", "wss"] : ["ws"],

        // Esta API usa Bearer token (no cookies de sesión Sanctum SPA), así que
        // Echo necesita un authorizer a medida que mande el Authorization header
        // al pegarle a /v1/broadcasting/auth. Sin esto la suscripción al canal
        // privado siempre falla con 401.
        authorizer: (channel: { name: string }) => ({
            authorize: (socketId: string, callback: (error: boolean, data: any) => void) => {
                // getSession() lee la misma clave localStorage("session") que ya usan
                // useCommentsSocket.ts/useNotifications.ts para tenantId/userId. Antes esto
                // llamaba a AuthService.getToken(), que lee localStorage("access_token") —
                // una clave que ningún flujo de login escribe (applyLoginSession en
                // auth-context.tsx solo guarda "session"); getToken() devolvía null SIEMPRE.
                //
                // session.token en sí NO es siempre un string a pesar de que SessionData lo
                // tipa como tal: api-client.ts ya lo maneja de forma defensiva ("La API
                // retorna token como objeto { access_token: "..." } o como string") porque
                // segun el flujo de login (normal vs challenge 2FA) el backend lo devuelve de
                // una forma u otra. Al usar session?.token directo sin este mismo
                // desempaquetado, cuando token venia como objeto el header terminaba en
                // literalmente "Bearer [object Object]" (confirmado en el payload de la
                // petición fallida) — visible en consola como 401 "Token inválido o
                // expirado", NO como "no hay sesión activa" (ese único log ya delataba que SÍ
                // había topado con un valor, solo que mal extraído). Mismo desempaquetado que
                // api-client.ts para no repetir el mismo tipo de bug dos veces.
                const session = getSession();
                const rawToken = session?.token as unknown;
                const token = typeof rawToken === "string"
                    ? rawToken
                    : (rawToken as { access_token?: string } | undefined)?.access_token
                        ?? (session as unknown as { access_token?: string } | undefined)?.access_token
                        ?? null;

                // Sin token no hay forma de que /broadcasting/auth autorice nada — pasa
                // durante el instante entre que se limpia la sesión (401 en cualquier otra
                // petición, ver api-client.ts) y que la navegación a /login termina de
                // desmontar la página. Fallar acá evita mandar un "Bearer " vacío al backend.
                if (!token) {
                    console.warn(`[echo] auth omitida para "${channel.name}": no hay sesión activa.`);
                    callback(true, { error: "No hay sesión activa." });
                    return;
                }

                fetch(`${envs.apiUrl}/broadcasting/auth`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ socket_id: socketId, channel_name: channel.name }),
                })
                    .then((res) => res.json().then((data) => ({ ok: res.ok, status: res.status, data })))
                    .then(({ ok, status, data }) => {
                        if (ok) {
                            console.log(`[echo] canal autorizado: "${channel.name}"`);
                        } else {
                            console.warn(`[echo] /broadcasting/auth respondió ${status} para "${channel.name}"`, data);
                        }
                        callback(!ok, data);
                    })
                    .catch((error) => {
                        console.error(`[echo] error de red autorizando "${channel.name}"`, error);
                        callback(true, error);
                    });
            },
        }),
    } as any) as ReverbEcho;

    // Log del ciclo de vida de la conexión base (no depende de ningún canal
    // privado: es el handshake con Reverb en sí). Sirve para distinguir en
    // consola "el socket nunca conectó" de "conectó pero ningún canal
    // autorizó" — dos fallas con síntomas idénticos desde el usuario pero
    // causas y arreglos totalmente distintos.
    echoInstance.connector.onConnectionChange((status) => {
        console.log(`[echo] conexión: ${status}`, { socketId: echoInstance?.connector.socketId() });
    });

    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
}
