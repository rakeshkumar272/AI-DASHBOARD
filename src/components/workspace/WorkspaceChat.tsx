"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User as UserIcon, Bot, Loader2, Globe, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: {
        documents: { fn: string; page: number }[];
        web: { title: string; url: string }[];
    };
    createdAt: string;
}

interface WorkspaceChatProps {
    workspaceId: string;
    initialMessages?: Message[];
}

export function WorkspaceChat({ workspaceId, initialMessages = [] }: WorkspaceChatProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (workspaceId) {
            fetchHistory();
        }
    }, [workspaceId]);

    const fetchHistory = async () => {
        try {
            const res = await fetch(`/api/workspaces/${workspaceId}/chat`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch(`/api/workspaces/${workspaceId}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg.content }),
            });

            if (res.ok) {
                const data = await res.json();
                setMessages((prev) => [...prev, data.message]);
            } else {
                console.error("Chat failed");
            }
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "assistant" && (
                                <div className="h-8 w-8 rounded-full bg-electric-purple/20 flex items-center justify-center shrink-0">
                                    <Bot className="h-5 w-5 text-electric-purple" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-lg p-4 ${msg.role === "user"
                                    ? "bg-electric-purple text-white"
                                    : "bg-slate-800 text-slate-200"
                                    }`}
                            >
                                <div className="prose prose-invert prose-sm">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>

                                {/* Sources Display */}
                                {msg.role === "assistant" && msg.sources && (
                                    <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2">
                                        {(msg.sources.documents?.length > 0 || msg.sources.web?.length > 0) && (
                                            <p className="text-xs font-semibold text-slate-400">Sources:</p>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {msg.sources.documents?.map((doc, i) => (
                                                <div key={i} className="flex items-center gap-1 text-xs bg-slate-900/50 px-2 py-1 rounded text-slate-400 border border-slate-700">
                                                    <FileText className="h-3 w-3" />
                                                    <span className="truncate max-w-[150px]">{doc.fn}</span>
                                                    {doc.page && <span>(p.{doc.page})</span>}
                                                </div>
                                            ))}
                                            {msg.sources.web?.map((web, i) => (
                                                <a
                                                    key={i}
                                                    href={web.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs bg-blue-900/20 px-2 py-1 rounded text-blue-300 border border-blue-900/50 hover:bg-blue-900/40 transition-colors"
                                                >
                                                    <Globe className="h-3 w-3" />
                                                    <span className="truncate max-w-[150px]">{web.title || "Web Source"}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {msg.role === "user" && (
                                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                                    <UserIcon className="h-5 w-5 text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-electric-purple/20 flex items-center justify-center shrink-0">
                                <Bot className="h-5 w-5 text-electric-purple" />
                            </div>
                            <div className="bg-slate-800 rounded-lg p-4 flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                                <span className="ml-2 text-sm text-slate-400">Thinking... searching knowledge base & web...</span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex gap-4">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your documents or the web..."
                        className="bg-slate-950 border-slate-800 focus-visible:ring-electric-purple"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-electric-purple hover:bg-electric-purple/90"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
