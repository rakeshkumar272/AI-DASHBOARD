"use client";
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import PageAnimate from "./PageAnimate";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role?: "admin" | "user"; // Mock role prop, in real app usage auth hook
}

export function DashboardLayout({ children, role = "user" }: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar for Desktop */}
            <div className="hidden lg:block">
                <Sidebar role={role} collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>

            {/* Mobile Drawer Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-background transition-transform duration-300 lg:hidden",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <Sidebar role={role} collapsed={false} setCollapsed={() => { }} />
            </div>

            {/* Main Content */}
            <div
                className={cn(
                    "flex flex-col min-h-screen transition-all duration-300",
                    collapsed ? "lg:pl-20" : "lg:pl-64"
                )}
            >
                <Navbar
                    onMenuClick={() => setMobileMenuOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <PageAnimate>
                        {children}
                    </PageAnimate>
                </main>
            </div>
        </div>
    );
}
