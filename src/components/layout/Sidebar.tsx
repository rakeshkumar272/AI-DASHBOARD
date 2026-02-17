import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    Users,
    Video,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    FolderGit2,
    FileText,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    role: "admin" | "user";
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ role, collapsed, setCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const adminLinks = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    const userLinks = [
        { href: "/dashboard", label: "Home", icon: LayoutDashboard },
        { href: "/dashboard/workspaces", label: "Workspaces", icon: FolderGit2 },
        { href: "/dashboard/documents", label: "Documents", icon: FileText },
        { href: "/dashboard/tools", label: "AI Tools", icon: Video },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    const links = role === "admin" ? adminLinks : userLinks;

    console.log("SIDEBAR_DEBUG:", {
        role,
        linkCount: links.length,
        labels: links.map(l => l.label),
        env: process.env.NODE_ENV
    });

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-card-border bg-background/80 backdrop-blur-xl transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex h-16 items-center justify-between px-4 border-b border-card-border">
                {!collapsed && (
                    <span className="text-xl font-bold bg-gradient-to-r from-electric-purple to-neon-cyan bg-clip-text text-transparent">
                        NexusDash
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="rounded-full p-1 hover:bg-white/10 text-slate-400"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 space-y-2 p-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 group",
                                isActive
                                    ? "bg-electric-purple/10 text-electric-purple shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "text-electric-purple")} />
                            {!collapsed && (
                                <span className="font-medium">{link.label}</span>
                            )}
                            {collapsed && isActive && (
                                <div className="absolute left-16 z-50 rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg">
                                    {link.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-card-border">
                <button
                    onClick={logout}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-400 transition-colors hover:bg-red-500/10",
                        collapsed && "justify-center"
                    )}
                >
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
