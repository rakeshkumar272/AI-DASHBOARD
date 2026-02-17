"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Folder, ArrowRight, Loader2, MoreVertical, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface Workspace {
    id: string;
    name: string;
    createdAt: string;
}

export default function WorkspacesPage() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const res = await fetch("/api/workspaces");
            if (res.ok) {
                const data = await res.json();
                setWorkspaces(data.workspaces);
            }
        } catch (error) {
            console.error("Failed to fetch workspaces", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;

        setIsCreating(true);
        try {
            const res = await fetch("/api/workspaces", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newWorkspaceName }),
            });

            if (res.ok) {
                const data = await res.json();
                setWorkspaces([data.workspace, ...workspaces]);
                setNewWorkspaceName("");
                router.push(`/dashboard/workspaces/${data.workspace.id}`);
            }
        } catch (error) {
            console.error("Failed to create workspace", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteWorkspace = async () => {
        if (!workspaceToDelete) return;

        try {
            const res = await fetch(`/api/workspaces/${workspaceToDelete}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setWorkspaces(workspaces.filter((w) => w.id !== workspaceToDelete));
                setWorkspaceToDelete(null);
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error("Failed to delete workspace. Status:", res.status, "Error:", errorData);
                alert(`Failed to delete workspace: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error deleting workspace", error);
            alert("Error deleting workspace. Check console.");
        }
    };

    return (
        <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout role="user">
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Workspaces</h1>
                            <p className="text-slate-400">Manage your knowledge bases and multi-document chats.</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Create New Workspace Card */}
                        <Card className="p-6 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900/80 transition-colors flex flex-col justify-center space-y-4">
                            <h3 className="text-lg font-semibold text-white">Create New Workspace</h3>
                            <form onSubmit={handleCreateWorkspace} className="space-y-4">
                                <Input
                                    placeholder="Workspace Name (e.g. Q4 Analysis)"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    className="bg-slate-950 border-slate-800"
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-electric-purple hover:bg-electric-purple/90"
                                    disabled={isCreating || !newWorkspaceName.trim()}
                                >
                                    {isCreating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                    Create Workspace
                                </Button>
                            </form>
                        </Card>

                        {/* Existing Workspaces */}
                        {isLoading ? (
                            <div className="col-span-full text-center text-slate-500 py-10">Loading workspaces...</div>
                        ) : (
                            workspaces.map((ws) => (
                                <Card key={ws.id} className="p-6 h-full border-slate-800 bg-slate-900 hover:border-slate-700 transition-colors relative group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 rounded-lg bg-electric-purple/10 text-electric-purple">
                                            <Folder className="h-6 w-6" />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 bg-slate-900 border-slate-800">
                                                <DropdownMenuItem className="text-slate-300 focus:text-white focus:bg-slate-800 cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Rename
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                                                    onClick={() => setWorkspaceToDelete(ws.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <Link href={`/dashboard/workspaces/${ws.id}`} className="block">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-electric-purple transition-colors">{ws.name}</h3>
                                        <p className="text-sm text-slate-500">Created {new Date(ws.createdAt).toLocaleDateString()}</p>
                                        <div className="mt-4 flex items-center text-electric-purple text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    </Link>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                <AlertDialog open={!!workspaceToDelete} onOpenChange={(open) => !open && setWorkspaceToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the workspace and remove all associated documents, chats, and data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteWorkspace} className="bg-red-600 hover:bg-red-700 text-white border-none">
                                Delete Workspace
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
