
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ user: null });
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.email) {
            return NextResponse.json({ user: null });
        }

        // Fetch fresh user data
        const [user] = await db.select().from(users).where(eq(users.email, payload.email as string));

        if (!user) {
            return NextResponse.json({ user: null });
        }

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json({ user: null });
    }
}
