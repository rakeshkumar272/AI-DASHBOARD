import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents, messages } from "@/db/schema";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq, asc } from "drizzle-orm";
import { generateChatResponse } from "@/lib/groq";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const payload = await verifyJWT(token!);

        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch document content
        const [doc] = await db.select().from(documents).where(eq(documents.id, id));

        if (!doc) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        if (doc.userId !== payload.id) {
            return NextResponse.json({ error: "Unauthorized access to document" }, { status: 403 });
        }

        // Save user message
        await db.insert(messages).values({
            documentId: id,
            role: "user",
            content: message,
        });

        // Fetch chat history for context (last 5 messages)
        const history = await db.select()
            .from(messages)
            .where(eq(messages.documentId, id))
            .orderBy(asc(messages.createdAt));
        // .limit(10); // Optionally limit context window

        // Construct prompt with context
        const promptMessages = [
            { role: "system", content: `You are a helpful AI assistant. You have access to the following document content:\n\n${doc.content}\n\nAnswer the user's question based on this content. If the answer is not in the document, say so.` },
            ...history.map((msg: any) => ({ role: msg.role as "user" | "assistant", content: msg.content })),
        ];

        // Generate AI response
        const aiResponse = await generateChatResponse(promptMessages as any);

        // Save AI response
        const [savedMessage] = await db.insert(messages).values({
            documentId: id,
            role: "assistant",
            content: aiResponse,
        }).returning();

        return NextResponse.json({ message: savedMessage });

    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const payload = await verifyJWT(token!);

        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check access
        const [doc] = await db.select().from(documents).where(eq(documents.id, id));
        if (!doc || doc.userId !== payload.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const chatHistory = await db.select()
            .from(messages)
            .where(eq(messages.documentId, id))
            .orderBy(asc(messages.createdAt));

        return NextResponse.json({ messages: chatHistory });
    } catch (error) {
        console.error("Fetch history error:", error);
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

        // Check document ownership first
        const [doc] = await db.select().from(documents).where(eq(documents.id, id));

        if (!doc) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        if (doc.userId !== payload.id) {
            return NextResponse.json({ error: "Unauthorized access to document" }, { status: 403 });
        }

        // Delete messages
        await db.delete(messages).where(eq(messages.documentId, id));

        return NextResponse.json({ message: "Chat history deleted successfully" });
    } catch (error) {
        console.error("Delete chat error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
