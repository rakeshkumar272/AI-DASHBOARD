import { NextResponse } from "next/server";
import { db } from "@/db";
import { workspaces } from "@/db/schema";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const payload = await verifyJWT(token!);

        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userWorkspaces = await db.select()
            .from(workspaces)
            .where(eq(workspaces.userId, payload.id as string))
            .orderBy(desc(workspaces.createdAt));

        return NextResponse.json({ workspaces: userWorkspaces });
    } catch (error) {
        console.error("Get workspaces error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const payload = await verifyJWT(token!);

        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Workspace name is required" }, { status: 400 });
        }

        const [newWorkspace] = await db.insert(workspaces).values({
            userId: payload.id as string,
            name,
        }).returning();

        return NextResponse.json({ workspace: newWorkspace });

    } catch (error) {
        console.error("Create workspace error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
