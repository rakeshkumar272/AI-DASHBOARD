// @ts-ignore
const pdf = require("pdf-parse/lib/pdf-parse.js");

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        console.log("pdf-parse: Starting parsing...");
        const data = await pdf(buffer);
        console.log("pdf-parse: Parsing successful. Pages:", data.numpages);
        return data.text;
    } catch (error: any) {
        console.error("Error extracting text from PDF:", error);
        // Fallback: Return a placeholder instead of throwing, so the upload succeeds
        return `(Text extraction failed: ${error.message}. Please try again later.)`;
    }
}
