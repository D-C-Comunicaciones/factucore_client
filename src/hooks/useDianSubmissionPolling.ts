import { useEffect, useRef, useState } from "react";

export type DianSubmissionStatus = "QUEUED" | "PROCESSING" | "SENT" | "FAILED" | undefined | null | string;

const TIMEOUT_MS = 90000;
const CHECK_INTERVAL_MS = 2000;

/**
 * Tracks how long a document has been QUEUED/PROCESSING on the backend and flags
 * `timedOut` after ~90s so the UI can stop spinning indefinitely (the doc keeps
 * processing server-side regardless; the user can come back later).
 */
export function useDianSubmissionPolling(status: DianSubmissionStatus) {
    const isPending = status === "QUEUED" || status === "PROCESSING";
    const [timedOut, setTimedOut] = useState(false);
    const pendingSinceRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isPending) {
            pendingSinceRef.current = null;
            setTimedOut(false);
            return;
        }

        if (pendingSinceRef.current === null) {
            pendingSinceRef.current = Date.now();
        }

        const checkElapsed = () => {
            if (pendingSinceRef.current !== null && Date.now() - pendingSinceRef.current >= TIMEOUT_MS) {
                setTimedOut(true);
            }
        };

        checkElapsed();
        const interval = setInterval(checkElapsed, CHECK_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [isPending]);

    const reset = () => {
        pendingSinceRef.current = Date.now();
        setTimedOut(false);
    };

    return { isPending, timedOut, reset };
}
