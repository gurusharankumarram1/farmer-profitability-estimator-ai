"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardPage() {
    const router = useRouter();
    useEffect(() => {
        // Redirect to estimate page (main feature)
        if (isAuthenticated()) {
            router.replace("/estimate");
        } else {
            router.replace("/login");
        }
    }, [router]);

    return (
        <main className="flex-1 flex items-center justify-center">
            <span className="spinner-green w-8 h-8" />
        </main>
    );
}
