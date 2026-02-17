import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateChatResponse(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
        });

        return chatCompletion.choices[0]?.message?.content || "I couldn't generate a response.";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error("Failed to communicate with AI service");
    }
}
