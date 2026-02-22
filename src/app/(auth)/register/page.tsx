"use client";

import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RegisterPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-12">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

            <main className="w-full max-w-md z-10 animate-fade-up">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to home
                </Link>

                {/* Logo Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20 mb-4">
                        <Sprout className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-center">{t("auth.createAccount")}</h1>
                    <p className="text-slate-500 mt-2 text-center text-sm">{t("auth.registerDesc")}</p>
                </div>

                {/* The Form */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-8">
                    <RegisterForm />
                </div>

                {/* Footer Link */}
                <p className="text-center text-slate-500 mt-8 text-sm">
                    {t("auth.hasAccount")}{" "}
                    <Link href="/login" className="font-semibold text-green-600 hover:text-green-700 transition-colors">
                        {t("auth.signin")}
                    </Link>
                </p>
            </main>
        </div>
    );
}
