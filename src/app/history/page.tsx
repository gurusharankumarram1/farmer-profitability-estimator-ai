"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchEstimateHistory } from "@/lib/api";
import { format } from "date-fns";
import ResultCard from "@/components/ResultCard";
import { Loader2, Calendar, MapPin, X, Leaf, Sprout } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HistoryPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEstimate, setSelectedEstimate] = useState<any | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace("/login");
            return;
        }
        loadHistory();
    }, [router]);

    async function loadHistory() {
        try {
            const res = await fetchEstimateHistory();
            if (res.success && res.data) {
                setHistory(res.data);
            }
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    }

    function formatCurrency(val: number) {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="w-full py-32 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading your past estimates…</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="animate-fade-up">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t("history.title")}</h2>
                    <p className="text-slate-500 mt-1">{t("history.subtitle")}</p>
                </div>

                {history.length === 0 ? (
                    <div className="card-glass flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Sprout className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{t("history.noHistory")}</h3>
                        <p className="text-slate-500 mt-2 max-w-sm">{t("history.noHistoryDesc")}</p>
                        <button onClick={() => router.push("/estimate")} className="btn-primary mt-6">
                            {t("history.startEstimating")}
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {history.map((record) => (
                            <div
                                key={record._id}
                                onClick={() => setSelectedEstimate(record)}
                                className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-green-300 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 ${record.netProfit >= 0 ? "from-green-500 to-emerald-500" : "from-red-500 to-rose-500"}`}></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                            <Leaf className="w-4 h-4 text-green-600" />
                                            {record.crop?.name || "Unknown Crop"}
                                        </h4>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 font-medium">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {record.region?.name}, {record.region?.district}
                                        </div>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-md text-xs font-bold ${record.netProfit >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {formatCurrency(record.netProfit)}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {format(new Date(record.created_at), "MMM do, yyyy")}
                                    </span>
                                    <span className="text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        {t("history.viewDetails")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Dialog/Modal for Selected Estimate ── */}
            {selectedEstimate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0"
                        onClick={() => setSelectedEstimate(null)}
                    />
                    <div className="relative bg-slate-50 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/40">
                        {/* Close Button Header */}
                        <div className="sticky top-0 right-0 left-0 bg-slate-50/90 backdrop-blur-md z-20 border-b border-slate-200 p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 tracking-tight">
                                    {selectedEstimate.crop?.name} in {selectedEstimate.region?.district}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">{t("history.savedOn")} {format(new Date(selectedEstimate.created_at), "PPP p")}</p>
                            </div>
                            <button
                                onClick={() => setSelectedEstimate(null)}
                                className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body with reused ResultCard */}
                        <div className="p-6">
                            <ResultCard
                                result={selectedEstimate}
                                payload={{
                                    cropId: selectedEstimate.crop?.name || "Unknown Crop",
                                    regionId: selectedEstimate.region?.district || "Unknown Region",
                                    landSizeAcres: selectedEstimate.inputs?.landSizeAcres || 0,
                                    irrigationType: selectedEstimate.inputs?.irrigationType || "Rainfed",
                                    costs: {
                                        seeds: selectedEstimate.inputs?.costs?.seeds || 0,
                                        fertilizer: selectedEstimate.inputs?.costs?.fertilizer || 0,
                                        pesticides: selectedEstimate.inputs?.costs?.pesticides || 0,
                                        labor: selectedEstimate.inputs?.costs?.labor || 0,
                                        irrigation: selectedEstimate.inputs?.costs?.irrigation || 0,
                                        equipment: selectedEstimate.inputs?.costs?.equipment || 0,
                                        transport: selectedEstimate.inputs?.costs?.transport || 0,
                                        miscellaneous: selectedEstimate.inputs?.costs?.miscellaneous || 0,
                                    }
                                }}
                                onReset={() => setSelectedEstimate(null)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
