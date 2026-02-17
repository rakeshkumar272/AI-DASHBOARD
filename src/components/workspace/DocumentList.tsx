"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Loader2, CheckCircle, AlertCircle, Trash2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Document {
    id: string;
    name: string;
    size: string;
    status: "UPLOADING" | "PROCESSING" | "PENDING" | "INDEXED" | "FAILED";
    createdAt: string;
}

interface DocumentListProps {
    workspaceId: string;
    documents: Document[];
}

export function DocumentList({ workspaceId, documents: initialDocs }: DocumentListProps) {
    const [documents, setDocuments] = useState<Document[]>(initialDocs);
    const [isUploading, setIsUploading] = useState(false);
    const [docToDelete, setDocToDelete] = useState<string | null>(null);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`/api/workspaces/${workspaceId}/documents`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setDocuments([data.document, ...documents]);
                router.refresh();
            } else {
                let errorMessage = "Unknown error";
                try {
                    const errData = await res.json();
                    console.error("Upload failed server response:", errData);
                    errorMessage = errData.error || JSON.stringify(errData);
                } catch (e) {
                    console.error("Failed to parse error response", e);
                    errorMessage = res.statusText;
                }
                alert(`Upload failed: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload error. Check console for details.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleDeleteDocument = async () => {
        if (!docToDelete) return;

        try {
            // Using a generic delete endpoint pattern
            const res = await fetch(`/api/workspaces/${workspaceId}/documents/${docToDelete}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setDocuments(documents.filter((d) => d.id !== docToDelete));
                setDocToDelete(null);
                router.refresh(); // Refresh to ensure sync
            } else {
                console.error("Failed to delete document");
                alert("Failed to delete document");
            }
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    // Retry logic is effectively just re-uploading, but improving UI:
    // Future improvement: Add re-index button that calls backend re-index.
    // For now, allow deleting failed and re-uploading.

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Documents</h3>
                <div className="relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".pdf,.txt,.md"
                        disabled={isUploading}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 cursor-pointer"
                        onClick={handleUploadClick}
                        disabled={isUploading}
                    >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                        Upload
                    </Button>
                </div>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {documents.length === 0 ? (
                    <div className="text-center p-8 border border-dashed border-slate-800 rounded-lg text-slate-500">
                        <p>No documents yet.</p>
                        <p className="text-sm">Upload PDF or Text files to start.</p>
                    </div>
                ) : (
                    documents.map((doc) => (
                        <Card key={doc.id} className="p-3 bg-slate-900 border-slate-800 flex items-center justify-between group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-slate-800 rounded">
                                    <FileText className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-medium text-slate-200 truncate">{doc.name}</p>
                                    <p className="text-xs text-slate-500">{doc.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {doc.status === "INDEXED" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {(doc.status === "PENDING" || doc.status === "PROCESSING" || doc.status === "UPLOADING") && (
                                    <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                                )}
                                {doc.status === "FAILED" && (
                                    <div className="flex items-center gap-1 text-red-500" title="Upload Pending/Failed">
                                        <AlertCircle className="h-4 w-4" />
                                    </div>
                                )}

                                <button
                                    onClick={() => setDocToDelete(doc.id)}
                                    className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete Document"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <AlertDialog open={!!docToDelete} onOpenChange={(open) => !open && setDocToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the document and its embeddings from the workspace. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteDocument} className="bg-red-600 hover:bg-red-700 text-white border-none">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
