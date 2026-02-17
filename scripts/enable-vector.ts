import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { neon } from '@neondatabase/serverless';

async function main() {
    console.log("Connecting to database...");
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not set");
        process.exit(1);
    }
    const sql = neon(process.env.DATABASE_URL);
    console.log("Enabling vector extension...");
    try {
        await sql('CREATE EXTENSION IF NOT EXISTS vector');
        console.log("Vector extension enabled successfully!");
    } catch (error) {
        console.error("Failed to enable vector extension:", error);
        process.exit(1);
    }
    process.exit(0);
}

main();
