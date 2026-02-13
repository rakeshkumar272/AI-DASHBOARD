"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout role="admin">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
                        <p className="text-slate-400">Manage system validation and configurations.</p>
                    </div>

                    <Card className="p-6 max-w-2xl space-y-4">
                        <h3 className="text-xl font-semibold text-white">General Settings</h3>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Site Name</label>
                            <Input defaultValue="NexusDash" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Admin Contact Email</label>
                            <Input defaultValue="admin@nexusdash.com" />
                        </div>
                        <Button variant="primary">Save Changes</Button>
                    </Card>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
