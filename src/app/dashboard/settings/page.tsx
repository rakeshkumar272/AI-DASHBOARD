"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserSettingsPage() {
    return (
        <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout role="user">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Account Settings</h1>
                        <p className="text-slate-400">Manage your profile and preferences.</p>
                    </div>

                    <Card className="p-6 max-w-2xl space-y-4">
                        <h3 className="text-xl font-semibold text-white">Profile Information</h3>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Display Name</label>
                            <Input defaultValue="Alex Code" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Email Address</label>
                            <Input defaultValue="alex@example.com" disabled />
                        </div>
                        <Button variant="primary">Update Profile</Button>
                    </Card>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
