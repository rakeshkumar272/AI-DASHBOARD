import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userDocuments = await db.select({
            id: documents.id,
            name: documents.name,
            type: documents.type,
            size: documents.size,
            createdAt: documents.createdAt,
        })
            .from(documents)
            .where(eq(documents.userId, payload.id as string))
            .orderBy(desc(documents.createdAt));

        return NextResponse.json({ documents: userDocuments });
    } catch (error) {
        console.error("Fetch documents error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
