import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                {icon && (
                    <div className="absolute left-3 text-slate-400">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-card-border bg-black/20 px-3 py-2 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-purple/50 disabled:cursor-not-allowed disabled:opacity-50",
                        icon && "pl-10",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = "Input";
