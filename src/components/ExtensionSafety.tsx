"use client";

import { useEffect } from "react";

/**
 * This component adds global event listeners to suppress annoying runtime errors
 * caused by browser extensions (like MetaMask, Phantom, etc.) that can trigger
 * the Next.js error overlay unnecessarily.
 */
export default function ExtensionSafety() {
    useEffect(() => {
        const handleGlobalError = (event: ErrorEvent) => {
            // MetaMask and other web3 wallet extensions common errors
            if (
                event.filename?.includes("chrome-extension") ||
                event.message?.includes("MetaMask") ||
                event.message?.includes("ethereum") ||
                (event.error as Error)?.stack?.includes("chrome-extension")
            ) {
                event.preventDefault();
                event.stopPropagation();
                console.warn("Suppressed extension error:", event.message);
                return true; // Stop propagation in some browsers
            }
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            // Check reason for extension-related strings
            const reason = event.reason?.message || event.reason?.toString() || "";
            const stack = event.reason?.stack || "";

            if (
                reason.includes("MetaMask") ||
                reason.includes("ethereum") ||
                stack.includes("chrome-extension")
            ) {
                event.preventDefault();
                console.warn("Suppressed unhandled extension rejection:", reason);
            }
        };

        window.addEventListener("error", handleGlobalError);
        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            window.removeEventListener("error", handleGlobalError);
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);

    return null;
}
