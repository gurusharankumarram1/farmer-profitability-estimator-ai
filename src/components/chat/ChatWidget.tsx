"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Bot, Loader2, RotateCcw } from "lucide-react";

import { useChatState } from "@/contexts/ChatStateContext";
import { getToken } from "@/lib/auth";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function ChatWidget() {
    const { isChatOpen, setIsChatOpen, chatContext } = useChatState();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const token = getToken();
            const response = await fetch("/api/chat-support", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
                    contextData: chatContext // Send ResultCard metadata to Backend System Prompt
                }),
            });

            if (!response.ok) throw new Error("Failed to reach support assistant.");

            const data = await response.json();
            const aiMessage: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Is samay support uplabdh nahi hai. Kripya baad mein koshish karein. (Support is currently unavailable. Please try again later.)"
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-scroll to bottom
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isChatOpen]);

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsChatOpen(true)}
                className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full 
        shadow-xl shadow-green-600/30 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50
        ${isChatOpen ? "opacity-0 pointer-events-none scale-0" : "opacity-100 scale-100"}`}
            >
                <MessageSquare className="w-6 h-6" />
            </button>

            {/* Slide-out Panel overlay for md screens */}
            {isChatOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsChatOpen(false)}
                />
            )}

            {/* Slide-out Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isChatOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Krishi Sahayak</h3>
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {messages.length > 0 && (
                            <button
                                onClick={() => setMessages([])}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                title="Restart Conversation"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-green-600">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-slate-700 mb-1">Namaste! How can I help you today?</h4>
                            <p className="text-sm text-slate-500">
                                Ask me anything about farm profitability, crop risks, and irrigation impact.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${m.role === "user" ? "bg-green-600 text-white" : "bg-white text-green-600 border border-slate-100"}`}>
                                        {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-green-600 text-white rounded-tr-none shadow-sm shadow-green-600/10" : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm"}`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {/* Loading Bubbles */}
                            {isLoading && (
                                <div className="flex gap-3 max-w-[85%] mr-auto">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-green-600 border border-slate-100 flex items-center justify-center shadow-sm">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="px-4 py-3 h-[42px] rounded-2xl bg-white border border-slate-100 rounded-tl-none shadow-sm flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div ref={endOfMessagesRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <form
                        onSubmit={handleSend}
                        className="relative flex items-center"
                    >
                        <input
                            type="text"
                            placeholder="Type your question..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-full pl-5 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-400"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-sm transition-all disabled:opacity-50 disabled:hover:bg-green-600"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">AI Support <span className="text-slate-300 mx-1">•</span> Alpha Version</span>
                    </div>
                </div>
            </div>
        </>
    );
}
