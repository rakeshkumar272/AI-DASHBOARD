"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, FileText, ArrowLeft, Loader2, ArrowDown, Trash2, AlertTriangle, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
};

export default function DocumentChatPage() {
    const params = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isNearBottomRef = useRef(true); // Track if user is at bottom

    useEffect(() => {
        if (params.id) {
            fetchHistory();
        }
    }, [params.id]);

    useEffect(() => {
        // Only auto-scroll if user was already at the bottom
        if (isNearBottomRef.current) {
            scrollToBottom();
        }
    }, [messages, isSending]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            if (isNearBottomRef.current) {
                scrollToBottom();
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            const { scrollHeight, clientHeight } = scrollContainerRef.current;
            scrollContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
            });
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            const distanceBot = scrollHeight - scrollTop - clientHeight;
            const isNear = distanceBot < 100;

            isNearBottomRef.current = isNear;
            setShowScrollButton(!isNear);
        }
    };

    async function fetchHistory() {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/documents/${params.id}/chat`);
            if (!res.ok) {
                if (res.status === 404) router.push("/dashboard/documents");
                return;
            }
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error("Failed to load history");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || isSending) return;

        const userMessage = input;
        setInput("");
        setIsSending(true);

        // Optimistic update
        const tempId = Date.now().toString();
        setMessages(prev => [...prev, { id: tempId, role: "user", content: userMessage, createdAt: new Date().toISOString() }]);

        // Force scroll to bottom when user sends
        isNearBottomRef.current = true;
        scrollToBottom();

        try {
            const res = await fetch(`/api/documents/${params.id}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!res.ok) throw new Error("Failed to send message");

            const data = await res.json();
            // Replace optimistic message with real one ideally, but appending AI response strictly for now
            // In a real app, we might replace the optimistic ID, but here we just add the assistant message
            setMessages(prev => [...prev, { id: data.message.id, role: "assistant", content: data.message.content, createdAt: data.message.createdAt }]);
        } catch (error) {
            console.error("Chat error:", error);
            // Optionally handle error state in UI
        } finally {
            setIsSending(false);
        }
    }

    async function handleDeleteChat() {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/documents/${params.id}/chat`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete chat");

            setMessages([]);
            setShowDeleteModal(false);
            // Optional: Show success toast/notification
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <DashboardLayout role="user">
            <div className="flex flex-col flex-1 min-h-0 gap-4 w-full">
                <div className="flex items-center space-x-4 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/documents")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Documents
                    </Button>
                    <div className="flex items-center px-3 py-1 bg-electric-purple/10 rounded-full text-electric-purple text-sm font-medium">
                        <FileText className="h-4 w-4 mr-2" />
                        Document Chat
                    </div>
                    <div className="flex-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteModal(true)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        title="Delete Chat History"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-xl border border-white/10 bg-card-bg/50 backdrop-blur-sm relative transition-shadow duration-300">
                    <div
                        className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4 outline-none"
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        tabIndex={0}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-electric-purple" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <Bot className="h-12 w-12 mb-4 opacity-50" />
                                <p>Ask a question about this document to get started.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full max-w-[80%]",
                                        msg.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex items-start space-x-2 p-4 rounded-2xl",
                                            msg.role === "user"
                                                ? "bg-electric-purple text-white rounded-br-none"
                                                : "bg-slate-800 text-slate-200 rounded-bl-none"
                                        )}
                                    >
                                        <div className="shrink-0 mt-1">
                                            {msg.role === "user" ? <User className="h-5 w-5 opacity-70" /> : <Bot className="h-5 w-5 text-neon-cyan" />}
                                        </div>
                                        <div className="prose prose-invert max-w-none text-sm leading-relaxed break-words">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {isSending && (
                            <div className="flex w-full max-w-[80%] mr-auto justify-start">
                                <div className="flex items-center space-x-2 p-4 rounded-2xl bg-slate-800 rounded-bl-none">
                                    <Bot className="h-5 w-5 text-neon-cyan animate-pulse" />
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {showScrollButton && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-20 right-8 rounded-full shadow-lg border border-slate-700 bg-slate-800/90 hover:bg-slate-700 z-10"
                            onClick={scrollToBottom}
                        >
                            <ArrowDown className="h-4 w-4 mr-2" />
                            Scroll to Bottom
                        </Button>
                    )}

                    <div className="p-4 border-t border-white/5 bg-slate-900/50 shrink-0">
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about the document..."
                                className="flex-1 bg-slate-800/50 border-slate-700 focus:border-electric-purple text-white"
                                disabled={isSending}
                            />
                            <Button type="submit" variant="primary" size="md" disabled={!input.trim() || isSending}>
                                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {
                showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-3 bg-red-500/10 rounded-full">
                                    <AlertTriangle className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Delete Chat History?</h3>
                                <p className="text-slate-400">
                                    Are you sure you want to delete this chat? This action cannot be undone and all messages will be permanently removed.
                                </p>
                            </div>

                            <div className="flex space-x-3 mt-8">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-300"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    className="flex-1 text-white border-red-600 bg-red-600/20 hover:bg-red-600/40"
                                    onClick={handleDeleteChat}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete Chat"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </DashboardLayout >
    );
}
