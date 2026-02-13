"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { register, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await register({ name, email, password });
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-vivid-pink/20 blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-electric-purple/20 blur-[120px]" />

            <Card className="w-full max-w-md p-8 border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400">Join NexusDash to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <Input
                                type="text"
                                placeholder="Alex Doe"
                                icon={<UserIcon className="h-4 w-4" />}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                icon={<Mail className="h-4 w-4" />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock className="h-4 w-4" />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-electric-purple hover:text-white transition-colors font-medium">
                            Sign in
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}
