import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents, workspaces, embeddings } from "@/db/schema";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { extractTextFromPDF } from "@/lib/pdf";
import { chunkText } from "@/lib/utils";
import { generateEmbeddingsBatch } from "@/lib/vector";

export const maxDuration = 60; // Allow 60 seconds for processing

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: workspaceId } = await params;
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

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "File is required" }, { status: 400 });
        }

        // Validation: File Size (10MB Limit)
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File size exceeds 10MB limit." }, { status: 400 });
        }

        // Validation: File Type
        const allowedTypes = ["application/pdf", "text/plain", "text/markdown"];
        if (!allowedTypes.includes(file.type) && !file.name.endsWith(".md") && !file.name.endsWith(".txt")) {
            return NextResponse.json({ error: "Invalid file type. Only PDF and Text files are allowed." }, { status: 400 });
        }

        console.log(`[Upload] Starting upload for: ${file.name} (${file.size} bytes)`);

        const buffer = Buffer.from(await file.arrayBuffer());
        let content = "";

        try {
            if (file.type === "application/pdf") {
                content = await extractTextFromPDF(buffer);
            } else {
                content = buffer.toString("utf-8");
            }
        } catch (parseError) {
            console.error("[Upload] Text extraction failed:", parseError);
            return NextResponse.json({ error: "Failed to extract text from file." }, { status: 400 });
        }

        if (!content.trim()) {
            return NextResponse.json({ error: "File content is empty or could not be read." }, { status: 400 });
        }

        // Create Document Record with PROCESSING status
        const [doc] = await db.insert(documents).values({
            userId: payload.id as string,
            workspaceId: workspaceId,
            name: file.name,
            type: file.type === "application/pdf" ? "PDF" : "TEXT",
            size: (file.size / 1024).toFixed(2) + " KB",
            content: content, // Storing full text for now, careful with DB size limits if huge
            status: "PROCESSING",
        }).returning();

        // Process Embeddings
        try {
            console.log(`[Upload] Chunking text for doc: ${doc.id}`);
            const chunks = chunkText(content);
            console.log(`[Upload] Generated ${chunks.length} chunks.`);

            console.log(`[Upload] Generating embeddings...`);
            const vectors = await generateEmbeddingsBatch(chunks);

            const embeddingRecords = chunks.map((chunk, index) => ({
                workspaceId: workspaceId,
                documentId: doc.id,
                content: chunk,
                vector: vectors[index],
                metadata: { page: 1, source: file.name, chunkIndex: index },
            }));

            // Batch Insert Embeddings
            const BATCH_SIZE = 50;
            for (let i = 0; i < embeddingRecords.length; i += BATCH_SIZE) {
                const batch = embeddingRecords.slice(i, i + BATCH_SIZE);
                await db.insert(embeddings).values(batch);
            }

            console.log(`[Upload] Indexing complete for doc: ${doc.id}`);
            await db.update(documents)
                .set({ status: "INDEXED" })
                .where(eq(documents.id, doc.id));

            return NextResponse.json({ message: "File uploaded and indexed successfully", document: { ...doc, status: "INDEXED" } });

        } catch (err: any) {
            console.error("[Upload] Embedding/Indexing failed:", err);
            // Log full error details
            if (err.response) {
                console.error("[Upload] Error Response:", await err.response.text());
            }

            await db.update(documents)
                .set({ status: "FAILED" })
                .where(eq(documents.id, doc.id));

            return NextResponse.json({
                error: `Indexing failed: ${err.message || "Unknown error"}`,
                details: JSON.stringify(err, Object.getOwnPropertyNames(err)),
                document: { ...doc, status: "FAILED" }
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Upload error (Top Level):", error);
        return NextResponse.json({
            error: `Internal Server Error: ${error.message || "Unknown"}`,
            details: JSON.stringify(error, Object.getOwnPropertyNames(error))
        }, { status: 500 });
    }
}
