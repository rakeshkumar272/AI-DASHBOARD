"use client";
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import PageAnimate from "./PageAnimate";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role?: "admin" | "user"; // Mock role prop, in real app usage auth hook
    disableScroll?: boolean;
}

export function DashboardLayout({ children, role = "user" }: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="h-screen flex bg-background text-foreground">
            {/* Sidebar for Desktop */}
            <div className="hidden lg:block h-full">
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
                    "fixed inset-y-0 left-0 z-50 w-64 h-full bg-background transition-transform duration-300 lg:hidden",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <Sidebar role={role} collapsed={false} setCollapsed={() => { }} />
            </div>

            {/* Main Content Wrapper */}
            <div
                className={cn(
                    "flex-1 flex flex-col min-h-0 transition-all duration-300",
                    collapsed ? "lg:pl-20" : "lg:pl-64"
                )}
            >
                <Navbar
                    onMenuClick={() => setMobileMenuOpen(true)}
                />

                <main className="flex-1 flex flex-col min-h-0 overflow-hidden p-6 md:p-8">
                    <PageAnimate>
                        {children}
                    </PageAnimate>
                </main>
            </div>
        </div>
    );
}
