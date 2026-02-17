"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DocumentList } from "@/components/workspace/DocumentList";
import { WorkspaceChat } from "@/components/workspace/WorkspaceChat";
import { useParams } from "next/navigation"; // Correct for client side
import { Loader2 } from "lucide-react";

export default function WorkspaceDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [workspace, setWorkspace] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchWorkspaceData();
    }, [id]);

    const fetchWorkspaceData = async () => {
        try {
            const res = await fetch(`/api/workspaces/${id}`);
            if (res.ok) {
                const data = await res.json();
                setWorkspace(data.workspace);
                setDocuments(data.documents);
            }
        } catch (error) {
            console.error("Failed to load workspace", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={["user", "admin"]}>
                <DashboardLayout role="user">
                    <div className="flex items-center justify-center h-[60vh]">
                        <Loader2 className="h-8 w-8 animate-spin text-electric-purple" />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    if (!workspace) {
        return (
            <ProtectedRoute allowedRoles={["user", "admin"]}>
                <DashboardLayout role="user">
                    <div className="text-center text-red-500 mt-10">Workspace not found</div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout role="user">
                <div className="flex h-[calc(100vh-100px)] gap-6">
                    {/* Left Sidebar: Documents */}
                    <div className="w-1/3 min-w-[300px] flex flex-col gap-4">
                        <div className="mb-2">
                            <h1 className="text-2xl font-bold text-white">{workspace.name}</h1>
                            <p className="text-sm text-slate-400">Created {new Date(workspace.createdAt).toLocaleDateString()}</p>
                        </div>
                        <DocumentList workspaceId={id} documents={documents} />
                    </div>

                    {/* Right Area: Chat */}
                    <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
                        <WorkspaceChat workspaceId={id} />
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
