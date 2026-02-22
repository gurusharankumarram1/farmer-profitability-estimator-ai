"use client";

import { useState, useEffect, FormEvent } from "react";
import {
    submitEstimate, fetchReferenceData,
    EstimateResult, EstimatePayload, ApiError,
    RefCrop, RefRegion, RefIrrigation,
} from "@/lib/api";
import ResultCard from "./ResultCard";
import { Leaf, MapPin, Droplets, Landmark, Calculator, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EstimateForm() {
    const { t } = useLanguage();
    const [crops, setCrops] = useState<RefCrop[]>([]);
    const [regions, setRegions] = useState<RefRegion[]>([]);
    const [irrigationTypes, setIrrigationTypes] = useState<RefIrrigation[]>([]);
    const [cropRegionMap, setCropRegionMap] = useState<Record<string, string[]>>({});
    const [dataLoaded, setDataLoaded] = useState(false);
    const [dataError, setDataError] = useState("");

    // ── Form state ──
    const [cropId, setCropId] = useState("");
    const [regionId, setRegionId] = useState("");
    const [landSize, setLandSize] = useState("");
    const [irrigationType, setIrrigationType] = useState("");
    const [costs, setCosts] = useState<Record<string, string>>({
        seeds: "", fertilizer: "", pesticides: "", labor: "",
        irrigation: "", equipment: "", transport: "", miscellaneous: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<EstimateResult | null>(null);
    const [lastPayload, setLastPayload] = useState<EstimatePayload | null>(null);

    // ── Load reference data on mount ──
    useEffect(() => {
        loadReferenceData();
    }, []);

    async function loadReferenceData() {
        try {
            const res = await fetchReferenceData();
            if (res.success && res.data) {
                setCrops(res.data.crops);
                setRegions(res.data.regions);
                setIrrigationTypes(res.data.irrigationTypes);
                setCropRegionMap(res.data.cropRegionMap || {});
                setDataLoaded(true);
                setDataError("");

                if (res.data.crops.length === 0) {
                    setDataError("No reference data found in the database. Please insert the reference data manually into MongoDB.");
                }
            }
        } catch (err) {
            setDataError(err instanceof ApiError ? err.message : "Failed to load form data. Please refresh.");
        }
    }

    function updateCost(key: string, value: string) {
        setCosts((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const payload: EstimatePayload = {
                cropId,
                regionId,
                landSizeAcres: parseFloat(landSize),
                irrigationType,
                costs: {
                    seeds: parseFloat(costs.seeds) || 0,
                    fertilizer: parseFloat(costs.fertilizer) || 0,
                    pesticides: parseFloat(costs.pesticides) || 0,
                    labor: parseFloat(costs.labor) || 0,
                    irrigation: parseFloat(costs.irrigation) || 0,
                    equipment: parseFloat(costs.equipment) || 0,
                    transport: parseFloat(costs.transport) || 0,
                    miscellaneous: parseFloat(costs.miscellaneous) || 0,
                },
            };

            const res = await submitEstimate(payload);
            if (res.success && res.data) {
                // Attach readable names so the Chat Assistant gets good context
                const cropName = crops.find(c => c.id === cropId)?.name || cropId;
                const regionName = regions.find(r => r.id === regionId)?.district || regionId;

                setLastPayload({
                    ...payload,
                    cropId: cropName,
                    regionId: regionName
                });
                setResult(res.data);
            }
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        setResult(null);
        setLastPayload(null);
    }

    // ── If we have a result, show ResultCard ──
    if (result && lastPayload) {
        return <ResultCard result={result} payload={lastPayload} onReset={handleReset} />;
    }

    // ── Loading state ──
    if (!dataLoaded && !dataError) {
        return (
            <div className="w-full py-32 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">{t("form.loading")}</p>
            </div>
        );
    }

    // ── Estimate Form ──
    return (
        <div className="w-full">
            {/* Global Errors */}
            {dataError && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium flex items-start gap-3">
                    <div className="mt-0.5">⚠️</div>
                    <div>{dataError}</div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-3">
                    <div className="mt-0.5">🚨</div>
                    <div>{error}</div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Column 1: Core Inputs */}
                    <div className="space-y-6">
                        {/* Section 1: Crop Selection */}
                        <div className="card shadow-sm border border-slate-200 p-6 rounded-2xl bg-white">
                            <div className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-5">
                                <Leaf className="w-5 h-5 text-green-600" />
                                {t("form.cropDetails")}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="crop" className="label text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">{t("form.cropSelect")}</label>
                                    <select
                                        id="crop"
                                        className="input-field bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                        value={cropId}
                                        onChange={(e) => {
                                            setCropId(e.target.value);
                                            setRegionId("");
                                        }}
                                        required
                                    >
                                        <option value="">Choose a crop</option>
                                        {crops.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="land" className="label text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">{t("form.landSize")}</label>
                                        <input
                                            id="land"
                                            type="number"
                                            step="0.1"
                                            min="0.1"
                                            className="input-field bg-slate-50 border-slate-200 focus:bg-white"
                                            placeholder="e.g. 5"
                                            value={landSize}
                                            onChange={(e) => setLandSize(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Region & Environment */}
                        <div className="card shadow-sm border border-slate-200 p-6 rounded-2xl bg-white">
                            <div className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-5">
                                <MapPin className="w-5 h-5 text-green-600" />
                                Location & Environment
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="region" className="label text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">{t("form.regionSelect")}</label>
                                    <select
                                        id="region"
                                        className="input-field bg-slate-50 border-slate-200 focus:bg-white disabled:opacity-50"
                                        value={regionId}
                                        onChange={(e) => setRegionId(e.target.value)}
                                        required
                                        disabled={!cropId}
                                    >
                                        <option value="">{cropId ? "Select geographic region" : "Select crop first"}</option>
                                        {regions
                                            .filter(r => !cropId || (cropRegionMap[cropId] && cropRegionMap[cropId].includes(r.id)))
                                            .map((r) => (
                                                <option key={r.id} value={r.id}>{r.name} — {r.district}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="irrigation" className="label text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 flex items-center gap-1">
                                        {t("form.irrigation")} <Droplets className="w-3 h-3 text-blue-500" />
                                    </label>
                                    <select
                                        id="irrigation"
                                        className="input-field bg-slate-50 border-slate-200 focus:bg-white"
                                        value={irrigationType}
                                        onChange={(e) => setIrrigationType(e.target.value)}
                                        required
                                    >
                                        <option value="">Select irrigation type</option>
                                        {irrigationTypes.map((t) => (
                                            <option key={t.id} value={t.type}>
                                                {t.type.charAt(0).toUpperCase() + t.type.slice(1)} (Yield Multiplier: {t.multiplier}x)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Financial Inputs */}
                    <div className="card shadow-sm border border-slate-200 p-6 rounded-2xl bg-white h-full flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                <Landmark className="w-5 h-5 text-green-600" />
                                {t("form.financials")}
                            </div>
                            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Currency: ₹ INR</span>
                        </div>

                        <p className="text-sm text-slate-500 mb-6">Enter estimated operational costs in INR for the total land size. Leave 0 if not applicable.</p>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-5 flex-1">
                            {Object.entries({
                                seeds: t("form.seeds"),
                                fertilizer: t("form.fertilizer"),
                                pesticides: t("form.pesticides"),
                                labor: t("form.labor"),
                                irrigation: t("form.irrigationCost"),
                                equipment: t("form.equipment"),
                                transport: t("form.transport"),
                                miscellaneous: t("form.misc")
                            }).map(([key, label]) => (
                                <div key={key}>
                                    <label htmlFor={`cost-${key}`} className="label text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1.5 truncate">
                                        {label}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                                        <input
                                            id={`cost-${key}`}
                                            type="number"
                                            min="0"
                                            className="input-field pl-8 bg-slate-50 border-slate-200 focus:bg-white"
                                            placeholder="0"
                                            value={costs[key]}
                                            onChange={(e) => updateCost(key, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit Banner Card */}
                <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-900/10">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{t("form.submit")}</h3>
                        <p className="text-slate-400 text-sm mt-1">{t("form.subtitle")}</p>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || crops.length === 0}
                        className="bg-green-500 hover:bg-green-400 text-slate-900 font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-green-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap min-w-[200px] justify-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
                        {loading ? t("form.loading") : t("form.submit")}
                    </button>
                </div>
            </form>
        </div>
    );
}
