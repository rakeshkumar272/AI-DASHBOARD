"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, MoreVertical } from "lucide-react";

type UserStatus = "PENDING" | "APPROVED" | "REJECTED";

interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    status: UserStatus;
    joinedDate: string;
}

const initialUsers: User[] = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "user", status: "PENDING", joinedDate: "2023-10-25" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", role: "user", status: "APPROVED", joinedDate: "2023-10-20" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "user", status: "REJECTED", joinedDate: "2023-10-22" },
    { id: "4", name: "David Wilson", email: "david@example.com", role: "user", status: "PENDING", joinedDate: "2023-10-26" },
    { id: "5", name: "Eva Green", email: "eva@example.com", role: "admin", status: "APPROVED", joinedDate: "2023-10-15" },
];

export function UserTable() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleStatusChange = async (id: string, newStatus: UserStatus) => {
        setLoadingId(id);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        setUsers((prev) =>
            prev.map((user) =>
                user.id === id ? { ...user, status: newStatus } : user
            )
        );
        setLoadingId(null);
    };

    const statusVariant = (status: UserStatus) => {
        switch (status) {
            case "APPROVED": return "success";
            case "PENDING": return "warning";
            case "REJECTED": return "error";
            default: return "default";
        }
    };

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-white/5 text-slate-200 font-medium uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                        {users.map((user) => (
                            <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-white">{user.name}</div>
                                        <div className="text-xs">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 capitalize">{user.role}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={statusVariant(user.status)}>
                                        {user.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">{user.joinedDate}</td>
                                <td className="px-6 py-4 text-right">
                                    {user.status === "PENDING" && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-8 w-8 p-0 rounded-full"
                                                onClick={() => handleStatusChange(user.id, "APPROVED")}
                                                isLoading={loadingId === user.id}
                                                disabled={!!loadingId}
                                            >
                                                {!loadingId && <Check className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0 rounded-full"
                                                onClick={() => handleStatusChange(user.id, "REJECTED")}
                                                isLoading={loadingId === user.id}
                                                disabled={!!loadingId}
                                            >
                                                {!loadingId && <X className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    )}
                                    {user.status !== "PENDING" && (
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
