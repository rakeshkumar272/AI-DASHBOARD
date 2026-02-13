"use client";

import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "bg-gradient-to-r from-electric-purple to-vivid-pink text-white hover:opacity-90 shadow-lg shadow-purple-500/20",
            secondary: "bg-card-bg border border-card-border text-foreground hover:bg-white/5",
            outline: "border border-electric-purple text-electric-purple hover:bg-electric-purple/10",
            ghost: "hover:bg-white/5 text-slate-300 hover:text-white",
            danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 text-sm",
            lg: "h-12 px-6 text-base",
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading || props.disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";
