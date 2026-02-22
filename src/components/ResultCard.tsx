"use client";

import { useEffect } from "react";
import { EstimateResult, EstimatePayload } from "@/lib/api";
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Activity, LineChart, MoveLeft, DollarSign, Scale, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChatState } from "@/contexts/ChatStateContext";

interface ResultCardProps {
    result: EstimateResult;
    payload: EstimatePayload; // Allow accessing crop/region/acreage for chat injection
    onReset: () => void;
}

function getRiskDetails(score: number) {
    if (score <= 25) return { label: "Low Risk", color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", icon: ShieldCheck };
    if (score <= 50) return { label: "Moderate", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", icon: AlertTriangle };
    if (score <= 75) return { label: "High Risk", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-200", icon: AlertTriangle };
    return { label: "Severe Risk", color: "text-red-700", bg: "bg-red-100", border: "border-red-200", icon: AlertTriangle };
}

function getRecommendation(isProfitable: boolean, score: number) {
    if (isProfitable && score <= 40) return { text: "Highly Recommended", badge: "bg-emerald-500", textCol: "text-white" };
    if (isProfitable && score > 40) return { text: "Proceed with Caution", badge: "bg-amber-500", textCol: "text-white" };
    return { text: "Not Recommended", badge: "bg-red-500", textCol: "text-white" };
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

export default function ResultCard({ result, payload, onReset }: ResultCardProps) {
    const { t } = useLanguage();
    const { setChatContext, openChat } = useChatState();

    useEffect(() => {
        // Pass result data to Context so the AI can use it
        setChatContext({
            // Note: In real app, you might pass translated strings for crop/region
            cropName: payload.cropId,       // Usually we'd want actual names here if possible
            regionName: payload.regionId,
            landSizeAcres: payload.landSizeAcres,
            irrigationType: payload.irrigationType,
            expectedYield: result.expectedYield,
            totalCost: result.totalCost,
            revenue: result.revenue,
            netProfit: result.netProfit
        });

        // Cleanup when ResultCard unmounts
        return () => setChatContext(null);
    }, [result, payload, setChatContext]);

    const risk = getRiskDetails(result.riskScore);
    const isProfitable = result.netProfit >= 0;
    const recommendation = getRecommendation(isProfitable, result.riskScore);
    const RiskIcon = risk.icon;

    return (
        <div className="w-full animate-fade-up">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t("result.title")}</h2>
                    <p className="text-slate-500 text-sm mt-1">{t("result.subtitle")}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={openChat}
                        className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95"
                    >
                        <MessageSquare className="w-4 h-4" /> Ask AI
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition-all hover:bg-slate-50 active:scale-95"
                    >
                        <MoveLeft className="w-4 h-4" /> New Estimate
                    </button>
                </div>
            </div>

            {/* ── Main Hero Card ── */}
            <div className={`relative overflow-hidden rounded-3xl p-8 mb-8 border shadow-xl ${isProfitable
                ? "bg-gradient-to-br from-emerald-500 to-green-600 border-green-600 shadow-green-500/20"
                : "bg-gradient-to-br from-red-500 to-rose-600 border-red-600 shadow-red-500/20"
                }`}>
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-black/10 rounded-full blur-2xl mix-blend-overlay"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-white/80 font-medium uppercase tracking-wider text-sm">{t("result.estimatedProfit")}</span>
                            <div className={`px-2.5 py-1 rounded-md text-xs font-bold ${recommendation.badge} ${recommendation.textCol} shadow-sm backdrop-blur-md bg-opacity-90`}>
                                {recommendation.text}
                            </div>
                        </div>
                        <div className="flex items-end gap-4">
                            <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-sm">
                                {formatCurrency(Math.abs(result.netProfit))}
                            </span>
                            {isProfitable ? (
                                <TrendingUp className="w-8 h-8 text-white/90 mb-2" strokeWidth={3} />
                            ) : (
                                <TrendingDown className="w-8 h-8 text-white/90 mb-2" strokeWidth={3} />
                            )}
                        </div>
                        <p className="text-white/80 font-medium mt-2">
                            {isProfitable ? t("result.profitPos") : t("result.profitNeg")}
                        </p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 min-w-[200px] border border-white/20">
                        <div className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" /> {t("result.riskScore")}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{result.riskScore}</span>
                            <span className="text-white/70 font-medium">/ 100</span>
                        </div>
                        <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className={`h-full bg-white rounded-full`} style={{ width: `${result.riskScore}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Key Metrics Grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                    icon={<Scale className="w-5 h-5 text-indigo-500" />}
                    label={t("result.expectedYield")}
                    value={`${formatNumber(result.expectedYield)}`}
                    suffix=" qtl"
                    color="indigo"
                />
                <MetricCard
                    icon={<LineChart className="w-5 h-5 text-blue-500" />}
                    label={t("result.selectedPrice")}
                    value={formatCurrency(result.selectedPrice)}
                    suffix="/qtl"
                    color="blue"
                />
                <MetricCard
                    icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
                    label={t("result.grossRevenue")}
                    value={formatCurrency(result.revenue)}
                    color="emerald"
                />
                <MetricCard
                    icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
                    label={t("result.totalCost")}
                    value={formatCurrency(result.totalCost)}
                    color="rose"
                />
            </div>

            {/* ── Risk Breakdown section ── */}
            <div className="card-glass border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <RiskIcon className={`w-5 h-5 ${risk.color}`} />
                        {t("result.riskAnalysis")}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${risk.bg} ${risk.color} border ${risk.border}`}>
                        {risk.label}
                    </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                    <ProgressBar label={t("result.riskWeather")} value={result.riskBreakdown.weatherRisk} />
                    <ProgressBar label={t("result.riskPrice")} value={result.riskBreakdown.priceVolatilityRisk} />
                    <ProgressBar label={t("result.riskIrrigation")} value={result.riskBreakdown.irrigationReliabilityRisk} />
                    <ProgressBar label={t("result.riskYield")} value={result.riskBreakdown.yieldVarianceRisk} />
                </div>
            </div>
        </div>
    );
}

/* ── Sub-components ── */

function MetricCard({ icon, label, value, suffix = "", color }: { icon: React.ReactNode, label: string, value: string | number, suffix?: string, color: string }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-xl font-bold text-slate-900 tracking-tight">
                    {value}<span className="text-sm font-medium text-slate-500 ml-0.5">{suffix}</span>
                </p>
            </div>
        </div>
    );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
    // Dynamic color scaling based on out of 100 risk
    const barColor =
        value <= 25 ? "bg-emerald-500" :
            value <= 50 ? "bg-amber-400" :
                value <= 75 ? "bg-orange-500" : "bg-red-500";

    return (
        <div className="group">
            <div className="flex justify-between items-end text-sm mb-2">
                <span className="font-semibold text-slate-700">{label}</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-xs">{value}/100</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
