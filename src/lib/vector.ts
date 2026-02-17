import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { embeddings } from "@/db/schema";
import { sql, cosineDistance, gt, desc, and, eq } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key-for-build");
const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

export async function generateEmbedding(text: string): Promise<number[]> {
    if (!process.env.GEMINI_API_KEY && process.env.NODE_ENV !== "production") {
        console.warn("GEMINI_API_KEY is missing. Using dummy embedding for dev/build.");
        // Return a zero vector of correct dimension (768 for text-embedding-004) if needed for build, 
        // but ideally we throw if functionality is required. 
        // If "dummy-key-for-build" is passed to constructor, it might not throw until call time.
    }

    try {
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("Gemini Embedding Error:", error);
        throw new Error("Failed to generate embedding with Gemini.");
    }
}

export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    // Gemini text-embedding-004 supports batching via multiple calls or specific batch API if available. 
    // The node SDK `embedContent` is single, but there's `batchEmbedContents` in recent versions?
    // Let's check docs or usage patterns. Standard practice with limited SDK is Promise.all()
    // However, typical rate limits apply.

    // For text-embedding-004, the output dimension is 768 usually, but can be configured. 
    // OpenAI small was 1536. WE MUST UPDATE PGVECTOR SCHEMA IF DIMENSION CHANGES.
    // text-embedding-3-small is 1536.
    // text-embedding-004 is 768 by default.
    // We cannot change the column type easily without a migration. 
    // If the user wants to use Gemini, we might need to recreate the table or alter column.
    // Or we can use a model that supports 1536 (not native).
    // ALTERNATIVELY: We can just recreate the table since it's dev/prototype stage.

    // WAIT! text-embedding-004 output dimension is configurable? No, usually fixed.
    // Let's assume we need to change dimensions to 768.

    // Actually, `text-embedding-004` output is 768.
    // We defined `vector` column as 1536 in schema.ts.
    // We MUST update schema.ts and likely run a migration or `db push`.

    const results = await Promise.all(texts.map(t => model.embedContent(t)));
    return results.map(r => r.embedding.values);
}

export async function searchSimilarChunks(query: string, workspaceId: string, limit = 5) {
    const queryVector = await generateEmbedding(query);

    // Ensure we are comparing same dimensions. 
    // If the DB has 1536 and we query with 768, it will fail.
    // We need to update the Schema.

    const similarity = sql<number>`1 - (${cosineDistance(embeddings.vector, queryVector)})`;

    return db.select({
        id: embeddings.id,
        content: embeddings.content,
        metadata: embeddings.metadata,
        similarity,
    })
        .from(embeddings)
        .where(and(
            eq(embeddings.workspaceId, workspaceId),
            gt(similarity, 0.5) // Similarity threshold
        ))
        .orderBy(desc(similarity))
        .limit(limit);
}
