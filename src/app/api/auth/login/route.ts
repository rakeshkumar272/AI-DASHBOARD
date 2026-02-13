
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { comparePassword, signJWT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user || !(await comparePassword(password, user.password))) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (user.status !== "APPROVED") {
            return NextResponse.json({ error: "Account pending approval" }, { status: 403 });
        }

        const token = await signJWT({ id: user.id, email: user.email, role: user.role });

        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
