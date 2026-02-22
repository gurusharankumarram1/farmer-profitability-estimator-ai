"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import EstimateForm from "@/components/EstimateForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function EstimatePage() {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Protect route
        if (!isAuthenticated()) {
            router.replace("/login");
            return;
        }
        setReady(true);
    }, [router]);

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <span className="spinner-green w-8 h-8" />
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="animate-fade-up">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Profitability Estimator</h2>
                    <p className="text-slate-500 mt-1">Fill in your farm details to get an AI-driven estimate of your profitability and risks.</p>
                </div>

                <EstimateForm />
            </div>
        </DashboardLayout>
    );
}
