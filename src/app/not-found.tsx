import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0f172a] text-white">
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-slate-800 p-4">
                    <FileQuestion className="h-10 w-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold">Page Not Found</h2>
                <p className="max-w-md text-slate-400">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link href="/">
                    <Button variant="primary">Go Home</Button>
                </Link>
            </div>
        </div>
    );
}
