"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "admin" | "user";

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: "PENDING" | "APPROVED" | "REJECTED";
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            setUser(data.user);
        } catch (error) {
            console.error("Failed to fetch user", error);
        } finally {
            setLoading(false);
        }
    }

    async function login(credentials: any) {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setUser(data.user);
        router.push("/dashboard");
        router.refresh();
    }

    async function register(formData: any) {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setUser(data.user);
        router.push("/dashboard");
        router.refresh();
    }

    async function logout() {
        // For now just clear local state, but ideally call an API to clear cookie too if needed (cookie is httpOnly so client can't clear it easily without API)
        // We should implement specific logout API or just set cookie to expire
        // For MVP, we can just reload or clear state, but security wise we need API.
        // Let's call a logout endpoint (future) or just rely on cookie expiry.
        // Actually, creating a logout route is better.
        // For now, let's assume valid logout clears cookie.

        // Quick fix: Set cookie to expire via Javascript? No, HttpOnly.
        // We need /api/auth/logout.

        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/login");
        router.refresh();
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
