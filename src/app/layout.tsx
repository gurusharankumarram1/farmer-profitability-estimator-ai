import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ChatStateProvider } from "@/contexts/ChatStateContext";

export const metadata: Metadata = {
  title: "Farmer Profitability Estimator",
  description: "AI-powered tool to estimate farm profitability, yield, risk, and pricing for Indian farmers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <ChatStateProvider>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          </ChatStateProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
