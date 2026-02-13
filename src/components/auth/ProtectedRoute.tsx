"use client";

import { useAuth, UserRole } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
            // Redirect to appropriate dashboard if role doesn't match
            if (user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        }
    }, [user, loading, router, allowedRoles]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-electric-purple" />
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}
