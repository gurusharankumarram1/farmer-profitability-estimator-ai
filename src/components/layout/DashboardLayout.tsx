"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Menu, X, Sprout, History, Globe } from "lucide-react";
import { logout, getUser } from "@/lib/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChatState } from "@/contexts/ChatStateContext";
import ChatWidget from "@/components/chat/ChatWidget";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();
    const { setChatContext } = useChatState();

    useEffect(() => {
        const user = getUser();
        if (user) setUserName(user.name);
    }, []);

    function handleLogout() {
        setChatContext(null); // Clear context to protect privacy
        logout();
        router.replace("/login");
    }

    const navLinks = [
        { name: t("nav.estimator"), href: "/estimate", icon: LayoutDashboard },
        { name: t("nav.history"), href: "/history", icon: History },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-100">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-md shadow-green-600/20">
                                <Sprout className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg text-slate-800 tracking-tight">AgriProfit<span className="text-green-600">.</span></span>
                        </Link>
                        <button
                            className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navLinks.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200
                                        ${isActive
                                            ? "bg-green-50 text-green-700 shadow-sm shadow-green-100/50"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }
                                    `}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? "text-green-600" : "text-slate-400"}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-slate-100 mt-auto">
                        <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{userName || "Farmer"}</p>
                                    <p className="text-xs text-slate-500 truncate">Premium Member</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                {t("nav.logout")}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-72 flex flex-col min-h-screen overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-slate-500 hover:text-slate-700 bg-slate-100 p-2 rounded-lg"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${language === "en" ? "bg-white text-green-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLanguage("hi")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${language === "hi" ? "bg-white text-green-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            HI
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </main>
                <ChatWidget />
            </div>
        </div>
    );
}
