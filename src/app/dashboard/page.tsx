"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AIVideoTool } from "@/components/dashboard/AIVideoTool";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function UserPage() {
    const { user } = useAuth();

    // Optional: protected route inside creates a flicker or null check requirement
    // Since we wrap everything in ProtectedRoute, we can just access user safely inside (or use optional chaining)
    const status = user?.status || "PENDING";

    if (status === "PENDING") {
        return (
            <ProtectedRoute allowedRoles={["user"]}>
                <DashboardLayout role="user">
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <Card className="max-w-md w-full text-center p-8 space-y-6 border-amber-500/20 bg-amber-500/5">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
                                <Clock className="h-10 w-10 text-amber-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white">Account Pending</h2>
                                <p className="text-slate-400">
                                    Your account is currently awaiting administrator approval. You will receive an email once your access is granted.
                                </p>
                            </div>
                            <Badge variant="warning" className="px-4 py-1 text-base">
                                Status: Pending Review
                            </Badge>
                        </Card>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout role="user">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back, {user?.name || "User"}!</h1>
                        <p className="text-slate-400">Ready to learn something new today?</p>
                    </div>

                    <AIVideoTool />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
