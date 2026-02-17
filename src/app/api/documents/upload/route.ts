import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { extractTextFromPDF } from "@/lib/pdf";

export const runtime = 'nodejs';

export async function POST(req: Request) {
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

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (file.type !== "application/pdf" && file.type !== "text/plain") {
            return NextResponse.json({ error: "Only PDF and Text files are allowed" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let content = "";

        if (file.type === "application/pdf") {
            console.log("Extracting text from PDF...");
            content = await extractTextFromPDF(buffer);
            console.log("PDF extraction complete. Content length:", content.length);
        } else {
            content = buffer.toString("utf-8");
        }

        if (!content.trim()) {
            console.log("No content extracted");
            return NextResponse.json({ error: "Could not extract text from file" }, { status: 400 });
        }

        console.log("Saving new document to DB...");
        const [doc] = await db.insert(documents).values({
            userId: payload.id as string,
            name: file.name,
            type: file.type === "application/pdf" ? "PDF" : "TEXT",
            content: content,
            size: (file.size / 1024).toFixed(2) + " KB",
        }).returning();
        console.log("Document saved:", doc.id);

        return NextResponse.json({ document: doc });
    } catch (error: any) {
        console.error("Upload error details:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
