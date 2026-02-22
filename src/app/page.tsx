"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, Sprout, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
    const { language, setLanguage, t } = useLanguage();
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-green-100 to-transparent -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
            <div className="absolute top-32 -left-24 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

            {/* Navbar */}
            <header className="px-6 lg:px-12 py-6 flex justify-between items-center z-10 w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
                        <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">AgriProfit<span className="text-green-600">.</span></span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className="hidden sm:flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1 rounded-full border border-slate-200">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${language === "en" ? "bg-white text-green-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLanguage("hi")}
                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${language === "hi" ? "bg-white text-green-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            HI
                        </button>
                    </div>

                    <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        {t("nav.login")}
                    </Link>
                    <Link href="/register" className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-md shadow-slate-900/10">
                        {t("nav.getStarted")}
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-24 text-center z-10 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-up">
                    <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">{t("landing.badge")}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-[1.1] mb-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
                    {t("landing.title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">{t("landing.titleHighlight")}</span> {t("landing.titleEnd")}
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 animate-fade-up whitespace-pre-line" style={{ animationDelay: "200ms" }}>
                    {t("landing.subtitle")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
                    <Link href="/register" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-green-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {t("landing.cta")}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link href="/login" className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-lg font-semibold px-8 py-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {t("landing.ctaSecondary")}
                    </Link>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 max-w-7xl mx-auto w-full px-4 md:px-8">
                    <FeatureCard
                        icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
                        title={t("landing.f1Title")}
                        desc={t("landing.f1Desc")}
                        delay="400ms"
                    />
                    <FeatureCard
                        icon={<BarChart3 className="w-6 h-6 text-emerald-600" />}
                        title={t("landing.f2Title")}
                        desc={t("landing.f2Desc")}
                        delay="500ms"
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />}
                        title={t("landing.f3Title")}
                        desc={t("landing.f3Desc")}
                        delay="600ms"
                    />
                    <FeatureCard
                        icon={<Sprout className="w-6 h-6 text-emerald-600" />}
                        title={t("landing.f4Title")}
                        desc={t("landing.f4Desc")}
                        delay="700ms"
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-12 z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-slate-800">AgriProfit.</span>
                    </div>
                    <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Farmer Profitability Estimator. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: string }) {
    return (
        <div
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 animate-fade-up text-left group"
            style={{ animationDelay: delay }}
        >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{desc}</p>
        </div>
    );
}
