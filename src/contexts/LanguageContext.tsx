"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { dictionaries, LanguageCode, TranslationKey } from "@/i18n/dictionaries";

interface LanguageContextProps {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<LanguageCode>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load preference from localStorage on mount
        const saved = localStorage.getItem("app_lang") as LanguageCode;
        if (saved && (saved === "en" || saved === "hi")) {
            setLanguageState(saved);
        }
        setMounted(true);
    }, []);

    const setLanguage = (lang: LanguageCode) => {
        setLanguageState(lang);
        localStorage.setItem("app_lang", lang);
    };

    const t = (key: TranslationKey): string => {
        // Fallback to English if key doesn't exist in current dict (safety fallback)
        return dictionaries[language]?.[key] || dictionaries["en"][key] || key;
    };


    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
