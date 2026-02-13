"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserTable } from "@/components/dashboard/UserTable";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AdminUsersPage() {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout role="admin">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">User Management</h1>
                        <p className="text-slate-400">View and manage all registered users.</p>
                    </div>
                    <UserTable />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
