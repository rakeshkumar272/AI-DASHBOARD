import { validateEnv } from "@/lib/env";

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        try {
            validateEnv();
            console.log("✅ Environment variables validated successfully.");
        } catch (error) {
            console.error("❌ Environment validation failed:", error);
            // In dev, we might want to just log/warn, but for strictness we throw.
            // However, throwing here might crash the dev server loop repeatedly.
            // Let's log heavily.
        }
    }
}
