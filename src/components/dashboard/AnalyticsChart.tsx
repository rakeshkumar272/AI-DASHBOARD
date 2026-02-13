"use client";

import { Card } from "@/components/ui/card";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const data = [
    { name: "Jan", users: 400, active: 240 },
    { name: "Feb", users: 300, active: 139 },
    { name: "Mar", users: 200, active: 980 },
    { name: "Apr", users: 278, active: 390 },
    { name: "May", users: 189, active: 480 },
    { name: "Jun", users: 239, active: 380 },
    { name: "Jul", users: 349, active: 430 },
];

export function AnalyticsChart() {
    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">User Activity Overview</h3>
                <p className="text-sm text-slate-400">Monthly user registrations and active sessions.</p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(15, 23, 42, 0.9)",
                                borderColor: "rgba(148, 163, 184, 0.1)",
                                backdropFilter: "blur(8px)",
                                color: "#f8fafc",
                                borderRadius: "8px",
                            }}
                            itemStyle={{ color: "#f8fafc" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#8B5CF6"
                            fillOpacity={1}
                            fill="url(#colorUsers)"
                        />
                        <Area
                            type="monotone"
                            dataKey="active"
                            stroke="#06B6D4"
                            fillOpacity={1}
                            fill="url(#colorActive)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
