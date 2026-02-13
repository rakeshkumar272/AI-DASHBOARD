
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
    onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    const { user } = useAuth();
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-card-border bg-background/80 px-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-slate-400 hover:text-white"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="hidden md:block w-64">
                    <Input
                        icon={<Search className="h-4 w-4" />}
                        placeholder="Search..."
                        className="bg-secondary/50 border-transparent focus:bg-secondary"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-vivid-pink"></span>
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
                        <p className="text-xs text-slate-400">{user?.email || "user@example.com"}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-electric-purple to-neon-cyan p-[1px]">
                        <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold">
                            {user?.name?.[0] || "U"}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
