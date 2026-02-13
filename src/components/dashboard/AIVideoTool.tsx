"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Video, Loader2, PlayCircle, FileText, CheckCircle2 } from "lucide-react";

export function AIVideoTool() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ summary: string; notes: string[] } | null>(null);

    const handleGenerate = async () => {
        if (!url) return;
        setLoading(true);
        // Simulate AI processing
        await new Promise((resolve) => setTimeout(resolve, 2500));
        setResult({
            summary: "This video explains the core concepts of React Server Components (RSC). It covers how RSCs differ from traditional SSR, the benefits of zero-bundle-size components, and how they integrate with Client Components.",
            notes: [
                "RCS run exclusively on the server.",
                "They reduce the amount of JavaScript sent to the client.",
                "Direct database access is possible within RSCs.",
                "Client Components are still needed for interactivity (state, effects).",
            ],
        });
        setLoading(false);
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-electric-purple/10">
                            <Video className="h-6 w-6 text-electric-purple" />
                        </div>
                        <h2 className="text-xl font-bold text-white">AI Video Summarizer</h2>
                    </div>
                    <p className="text-slate-400">
                        Paste a YouTube link to generate a concise summary and study notes instantly.
                    </p>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">YouTube URL</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://youtube.com/watch?v=..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleGenerate}
                                isLoading={loading}
                                disabled={!url || loading}
                            >
                                Generate
                            </Button>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center py-8 text-electric-purple">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="text-sm font-medium animate-pulse">Analyzing video content...</span>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Recent History Mock */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-card-border bg-white/5">
                        <h3 className="font-semibold text-white">Recent Generations</h3>
                    </div>
                    <div className="divide-y divide-card-border">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors cursor-pointer">
                                <PlayCircle className="h-5 w-5 text-slate-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-200 truncate">Advanced TypeScript Patterns</p>
                                    <p className="text-xs text-slate-500">2 hours ago</p>
                                </div>
                                <Badge variant="success">Completed</Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Results Area */}
            <div className="space-y-6">
                {result ? (
                    <Card className="h-full bg-gradient-to-b from-card-bg to-slate-900/50 border-electric-purple/30">
                        <div className="space-y-6">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-electric-purple mb-2">
                                    <FileText className="h-5 w-5" /> Summary
                                </h3>
                                <p className="text-slate-300 leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">
                                    {result.summary}
                                </p>
                            </div>

                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-neon-cyan mb-2">
                                    <CheckCircle2 className="h-5 w-5" /> Key Study Notes
                                </h3>
                                <ul className="space-y-3">
                                    {result.notes.map((note, i) => (
                                        <li key={i} className="flex gap-3 text-slate-300 bg-black/20 p-3 rounded-lg border border-white/5">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neon-cyan/10 text-xs font-bold text-neon-cyan">
                                                {i + 1}
                                            </span>
                                            {note}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button variant="outline" className="w-full">Export PDF</Button>
                                <Button variant="secondary" className="w-full">Copy to Clipboard</Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-card-border rounded-xl bg-white/5">
                        <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                            <Video className="h-8 w-8 text-slate-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-300">No content generated yet</h3>
                        <p className="text-slate-500 max-w-xs mt-2">
                            Enter a video URL on the left to see the magic happen here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
