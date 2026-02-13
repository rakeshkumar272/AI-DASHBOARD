"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AIVideoTool } from "@/components/dashboard/AIVideoTool";

export default function ToolsPage() {
    return (
        <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout role="user">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">AI Tools</h1>
                        <p className="text-slate-400">Access our suite of AI-powered study aids.</p>
                    </div>
                    <AIVideoTool />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
