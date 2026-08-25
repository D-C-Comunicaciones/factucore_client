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
                // useCommentsSocket.ts/useNotifications.ts para tenantId/userId, y que
                // api-client.ts usa (con fallback) para el Authorization header de las
                // peticiones REST. Antes esto llamaba a AuthService.getToken(), que lee
                // localStorage("access_token") — una clave que ningún flujo de login
                // escribe (applyLoginSession en auth-context.tsx solo guarda "session");
                // getToken() devolvía null SIEMPRE, así que el authorizer fallaba rápido
                // sin siquiera intentar la petición a /broadcasting/auth. Ninguna
                // suscripción a canal privado autorizaba jamás: cero comentarios/
                // menciones/recordatorios en tiempo real, para nadie, en ninguna sesión.
                const token = getSession()?.token;

                // Sin token no hay forma de que /broadcasting/auth autorice nada — pasa
                // durante el instante entre que se limpia la sesión (401 en cualquier otra
                // petición, ver api-client.ts) y que la navegación a /login termina de
                // desmontar la página. Fallar acá evita mandar un "Bearer " vacío al backend.
                if (!token) {
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
                    .then((res) => res.json())
                    .then((data) => callback(false, data))
                    .catch((error) => callback(true, error));
            },
        }),
    } as any) as ReverbEcho;

    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
}
