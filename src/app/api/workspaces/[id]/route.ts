import { NextResponse } from "next/server";
import { db } from "@/db";
import { workspaces, documents } from "@/db/schema";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const payload = await verifyJWT(token!);

        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [workspace] = await db.select()
            .from(workspaces)
            .where(and(eq(workspaces.id, id), eq(workspaces.userId, payload.id as string)));

        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        // Fetch documents in this workspace
        const workspaceDocs = await db.select()
            .from(documents)
            .where(eq(documents.workspaceId, id))
            .orderBy(desc(documents.createdAt));

        return NextResponse.json({ workspace, documents: workspaceDocs });

    } catch (error) {
        console.error("Get workspace details error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const payload = await verifyJWT(token!);

        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [workspace] = await db.select()
            .from(workspaces)
            .where(and(eq(workspaces.id, id), eq(workspaces.userId, payload.id as string)));

        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        await db.delete(workspaces).where(eq(workspaces.id, id));

        return NextResponse.json({ message: "Workspace deleted successfully" });

    } catch (error: any) {
        console.error("Delete workspace error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message || String(error)
        }, { status: 500 });
    }
}
