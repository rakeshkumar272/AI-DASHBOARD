"use client";

import { ReactNode } from "react";

export default function PageAnimate({ children }: { children: ReactNode }) {
    return (
        <div className="flex-1 flex flex-col min-h-0 w-full">
            {children}
        </div>
    );
}
