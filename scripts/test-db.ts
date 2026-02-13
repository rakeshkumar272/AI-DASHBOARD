import dotenv from 'dotenv';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Load env vars first
dotenv.config({ path: '.env.local' });

// Configure WebSocket
neonConfig.webSocketConstructor = ws;

async function main() {
    // Dynamic import to ensure env vars are loaded
    console.log('Importing database module...');
    const { db } = await import('../src/db/index');
    const { users } = await import('../src/db/schema');

    console.log('Testing database connection...');
    try {
        const result = await db.select().from(users).limit(1);
        console.log('Connection successful!');
        console.log('Query result:', result);
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        process.exit(0);
    }
}

main();
