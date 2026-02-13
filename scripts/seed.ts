
import dotenv from 'dotenv';
// Load env vars first
dotenv.config({ path: '.env.local' });

import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import bcrypt from 'bcryptjs';

// Configure WebSocket
neonConfig.webSocketConstructor = ws;

async function main() {
    console.log('🌱 Starting seed...');

    // Dynamic import to ensure env vars are loaded
    const { db } = await import('../src/db/index');
    const { users } = await import('../src/db/schema');
    const { eq } = await import('drizzle-orm');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const initialUsers = [
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin' as const,
            status: 'APPROVED' as const,
        },
        {
            name: 'Demo User',
            email: 'user@example.com',
            password: hashedPassword,
            role: 'user' as const,
            status: 'APPROVED' as const,
        },
        {
            name: 'Pending User',
            email: 'pending@example.com',
            password: hashedPassword,
            role: 'user' as const,
            status: 'PENDING' as const,
        },
    ];

    for (const user of initialUsers) {
        const existing = await db.select().from(users).where(eq(users.email, user.email));
        if (existing.length === 0) {
            await db.insert(users).values(user);
            console.log(`✅ Created user: ${user.email}`);
        } else {
            console.log(`ℹ️  User already exists: ${user.email}`);
        }
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
