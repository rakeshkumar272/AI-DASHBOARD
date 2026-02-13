"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserTable } from "@/components/dashboard/UserTable";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { Card } from "@/components/ui/card";
import { Users, UserCheck, Clock, Layers } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AdminPage() {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout role="admin">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Admin Dashboard</h1>
                        <p className="text-slate-400">Manage users and system settings.</p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <KPICard title="Total Users" value="1,248" change="+12%" icon={<Users className="text-electric-purple" />} />
                        <KPICard title="Active Users" value="842" change="+5%" icon={<UserCheck className="text-neon-cyan" />} />
                        <KPICard title="Pending Approval" value="18" change="-2" icon={<Clock className="text-amber-400" />} />
                        <KPICard title="Total Conversion" value="24.5%" change="+1.2%" icon={<Layers className="text-vivid-pink" />} />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-7">
                        <div className="col-span-4">
                            <AnalyticsChart />
                        </div>
                        <div className="col-span-3">
                            <Card className="h-full p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">CPU Usage</span>
                                        <span className="text-emerald-400">24%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[24%]" />
                                    </div>

                                    <div className="flex justify-between text-sm pt-2">
                                        <span className="text-slate-400">Memory Usage</span>
                                        <span className="text-amber-400">65%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[65%]" />
                                    </div>

                                    <div className="flex justify-between text-sm pt-2">
                                        <span className="text-slate-400">Database Load</span>
                                        <span className="text-electric-purple">12%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-electric-purple w-[12%]" />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Recent Registrations</h2>
                        <UserTable />
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

function KPICard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
    const isPositive = change.startsWith("+");
    return (
        <Card hoverEffect className="p-0">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
                </div>
                <div className="rounded-lg bg-white/5 p-2 backdrop-blur-sm">
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className={isPositive ? "text-emerald-400" : "text-red-400"}>
                    {change}
                </span>
                <span className="ml-2 text-slate-500">from last month</span>
            </div>
        </Card>
    );
}
