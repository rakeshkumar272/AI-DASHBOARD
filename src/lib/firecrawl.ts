import FirecrawlApp from 'firecrawl';

const apiKey = process.env.FIRECRAWL_API_KEY;
let app: FirecrawlApp | null = null;

if (apiKey) {
    app = new FirecrawlApp({ apiKey });
}

export async function searchWeb(query: string) {
    if (!app) {
        console.warn("Firecrawl API Key not found. Web search disabled.");
        return [];
    }

    try {
        const response: any = await (app as any).search(query, {
            searchOptions: {
                limit: 3
            }
        });

        if (!response.data) return [];

        return response.data.map((item: any) => ({
            url: item.url,
            title: item.title,
            content: item.markdown || item.content || item.description || "",
        }));

    } catch (error) {
        console.error("Firecrawl search error:", error);
        return []; // Fail gracefully
    }
}
