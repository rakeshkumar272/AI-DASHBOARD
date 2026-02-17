export function validateEnv() {
    const requiredVars = [
        "DATABASE_URL",
        "GEMINI_API_KEY",
        // "FIRECRAWL_API_KEY", // Optional for now
        // "GROQ_API_KEY", // Optional for now
    ];

    const missingVars = requiredVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
    }
}
