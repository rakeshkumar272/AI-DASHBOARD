import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-electric-purple/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-cyan/20 blur-[120px]" />
      </div>

      <div className="z-10 text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            NexusDash
          </h1>
          <p className="text-lg text-slate-400">
            A modern, glassmorphic dashboard for managing users and AI-powered insights.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link href="/admin">
            <Card hoverEffect className="h-full p-6 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer border-white/5 hover:border-electric-purple/30">
              <div className="p-4 rounded-full bg-electric-purple/10 group-hover:bg-electric-purple/20 transition-colors">
                <ShieldCheck className="h-8 w-8 text-electric-purple" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Admin Portal</h3>
                <p className="text-sm text-slate-400">
                  Manage users, view analytics, and handle approvals.
                </p>
              </div>
              <Button variant="outline" className="w-full mt-2 group-hover:bg-electric-purple group-hover:text-white group-hover:border-electric-purple">
                Enter as Admin <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </Link>

          <Link href="/dashboard">
            <Card hoverEffect className="h-full p-6 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer border-white/5 hover:border-neon-cyan/30">
              <div className="p-4 rounded-full bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition-colors">
                <LayoutDashboard className="h-8 w-8 text-neon-cyan" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">User Dashboard</h3>
                <p className="text-sm text-slate-400">
                  Access AI tools, view content, and track progress.
                </p>
              </div>
              <Button variant="outline" className="w-full mt-2 group-hover:bg-neon-cyan group-hover:text-black group-hover:border-neon-cyan">
                Enter as User <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </Link>
        </div>

        <div className="pt-8 text-xs text-slate-600">
          <p>Built with Next.js 15, Tailwind CSS v4, and Recharts.</p>
        </div>
      </div>
    </div>
  );
}
