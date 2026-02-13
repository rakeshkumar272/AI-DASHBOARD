"use client";

import { cn } from "@/lib/utils";
import { forwardRef, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    hoverEffect?: boolean;
    children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = false, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={hoverEffect ? { y: -5 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
                className={cn(
                    "relative overflow-hidden rounded-xl border border-card-border bg-card-bg backdrop-blur-md transition-shadow duration-300",
                    hoverEffect && "hover:border-electric-purple/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
                    className
                )}
                {...props}
            >
                <div className="relative z-10 p-6">{children}</div>
            </motion.div>
        );
    }
);
Card.displayName = "Card";
