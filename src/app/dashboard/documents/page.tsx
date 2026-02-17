"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, MessageSquare, Trash2, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type Document = {
    id: string;
    name: string;
    type: "PDF" | "TEXT";
    size: string;
    createdAt: string;
};

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    useEffect(() => {
        fetchDocuments();
    }, []);

    async function fetchDocuments() {
        try {
            const res = await fetch("/api/documents");
            const data = await res.json();
            setDocuments(data.documents || []);
        } catch (error) {
            console.error("Failed to load documents");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Upload failed");

            // Refresh list
            fetchDocuments();
        } catch (error: any) {
            setUploadError(error.message);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <DashboardLayout role="user"> {/* Access control handled by layout/middleware usually, but explicit role here */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Documents</h1>
                        <p className="text-slate-400">Upload documents and ask AI questions about them.</p>
                    </div>
                    <div className="relative">
                        <Input
                            type="file"
                            accept=".pdf,.txt"
                            className="hidden"
                            id="file-upload"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                        <Button
                            variant="primary"
                            className="cursor-pointer"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Upload New
                        </Button>
                    </div>
                </div>

                {uploadError && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {uploadError}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-electric-purple" />
                    </div>
                ) : documents.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-12 border-dashed border-2 border-slate-700 bg-transparent">
                        <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">No documents yet</h3>
                        <p className="text-slate-400 text-center max-w-sm mb-6">
                            Upload a PDF or text file to start chatting with your knowledge base.
                        </p>
                        <Button
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Upload Document
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <Link href={`/dashboard/documents/${doc.id}`} key={doc.id}>
                                <Card className="p-6 h-full hover:border-electric-purple/50 transition-colors group cursor-pointer bg-card-bg/50 backdrop-blur-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-lg bg-electric-purple/10 text-electric-purple group-hover:bg-electric-purple/20 transition-colors">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                            {doc.type}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-white mb-1 truncate" title={doc.name}>{doc.name}</h3>
                                    <div className="flex items-center text-xs text-slate-500 space-x-3 mb-4">
                                        <span>{doc.size}</span>
                                        <span>•</span>
                                        <span>{format(new Date(doc.createdAt), 'MMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-electric-purple font-medium">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Start Chat
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
