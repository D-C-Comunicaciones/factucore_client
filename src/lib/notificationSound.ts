// Sonido para TODAS las notificaciones en tiempo real (menciones, recordatorios, y lo que se
// agregue después) — un único Audio reutilizado en vez de instanciar uno nuevo por notificación,
// y el archivo vive como asset estático (public/sounds) para que el navegador lo cachee tras la
// primera reproducción en vez de pedirlo al backend cada vez.
let audio: HTMLAudioElement | null = null;

export function playNotificationSound(): void {
    if (typeof window === "undefined") return;

    if (!audio) {
        audio = new Audio("/sounds/notification-sound.mp3");
        audio.volume = 0.5;
    }

    // Si llega una notificación mientras la anterior todavía está sonando, reinicia desde el
    // principio en vez de encolar reproducciones.
    audio.currentTime = 0;

    // Los navegadores bloquean el autoplay de audio hasta que el usuario interactuó con la
    // página — para entonces ya inició sesión, así que en la práctica siempre puede sonar; el
    // catch solo evita un error sin manejar en la consola si por lo que sea no puede.
    audio.play().catch(() => {});
}
