"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerUser, verifyOtpUser, ApiError } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RegisterForm() {
    const { t } = useLanguage();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"register" | "otp">("register");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (step === "register") {
                const res = await registerUser({ name, email, password });
                if (res.success && res.data?.isOtpRequired) {
                    setStep("otp");
                }
            } else if (step === "otp") {
                const res = await verifyOtpUser({ email, otp });
                if (res.success && res.data) {
                    saveAuth(res.data.token, res.data.user);
                    router.push("/estimate");
                }
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full">
            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-fade-up">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {step === "register" ? (
                    <>
                        <div>
                            <label htmlFor="reg-name" className="label">{t("auth.name") || "Full Name"}</label>
                            <input
                                id="reg-name"
                                type="text"
                                className="input-field"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                minLength={2}
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-email" className="label">{t("auth.email") || "Email Address"}</label>
                            <input
                                id="reg-email"
                                type="email"
                                className="input-field"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-password" className="label">{t("auth.password") || "Password"}</label>
                            <input
                                id="reg-password"
                                type="password"
                                className="input-field"
                                placeholder="Min 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                            {loading && <span className="spinner" />}
                            {loading ? t("auth.registering") || "Creating account..." : t("auth.signup") || "Sign up"}
                        </button>
                    </>
                ) : (
                    <>
                        <div>
                            <label htmlFor="otp" className="label">Enter OTP</label>
                            <p className="text-sm text-slate-500 mb-2">We sent a 6-digit code to {email}</p>
                            <input
                                id="otp"
                                type="text"
                                className="input-field text-center text tracking-widest font-mono text-xl"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength={6}
                                minLength={6}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                            {loading && <span className="spinner" />}
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep("register")}
                            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors w-full mt-4 text-center"
                        >
                            Back to registration
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
