import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents, workspaces } from "@/db/schema";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; docId: string }> }) {
    try {
        const { id: workspaceId, docId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const payload = await verifyJWT(token!);

        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify workspace access
        const [workspace] = await db.select()
            .from(workspaces)
            .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, payload.id as string)));

        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        // Verify document exists and belongs to workspace
        const [doc] = await db.select()
            .from(documents)
            .where(and(eq(documents.id, docId), eq(documents.workspaceId, workspaceId)));

        if (!doc) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        // Delete document (Chunks/Embeddings should cascade delete if configured)
        // Even if cascade is set, explicit delete ensures we hit it.
        await db.delete(documents).where(eq(documents.id, docId));

        return NextResponse.json({ message: "Document deleted successfully" });

    } catch (error) {
        console.error("Delete document error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
