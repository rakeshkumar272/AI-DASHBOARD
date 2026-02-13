"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0f172a] text-white">
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-red-500/10 p-4">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold">Something went wrong!</h2>
                <p className="max-w-md text-slate-400">
                    We encountered an unexpected error. This might be caused by a browser extension or a temporary glitch.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Reload Page
                    </Button>
                    <Button onClick={() => reset()} variant="primary">
                        Try Again
                    </Button>
                </div>
            </div>
        </div>
    );
}
