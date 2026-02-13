import { cn } from "@/lib/utils";

interface BadgeProps {
    variant?: "default" | "success" | "warning" | "error" | "info";
    className?: string;
    children: React.ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
    const variants = {
        default: "bg-slate-800 text-slate-300 border-slate-700",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", // Approved
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20", // Pending
        error: "bg-red-500/10 text-red-400 border-red-500/20", // Rejected
        info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
