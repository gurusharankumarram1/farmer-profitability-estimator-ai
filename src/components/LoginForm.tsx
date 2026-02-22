"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUser, ApiError } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginForm() {
    const { t } = useLanguage();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await loginUser({ email, password });
            if (res.success && res.data) {
                saveAuth(res.data.token, res.data.user);
                router.push("/estimate");
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
                <div>
                    <label htmlFor="login-email" className="label">{t("auth.email")}</label>
                    <input
                        id="login-email"
                        type="email"
                        className="input-field"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="login-password" className="label">{t("auth.password")}</label>
                    <input
                        id="login-password"
                        type="password"
                        className="input-field"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                    {loading && <span className="spinner" />}
                    {loading ? t("auth.loggingIn") : t("auth.signin")}
                </button>
            </form>
        </div>
    );
}
