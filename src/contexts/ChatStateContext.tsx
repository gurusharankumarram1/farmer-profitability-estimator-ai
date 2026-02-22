"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ChatContextData {
    cropName?: string;
    regionName?: string;
    landSizeAcres?: number;
    irrigationType?: string;
    expectedYield?: number;
    totalCost?: number;
    revenue?: number;
    netProfit?: number;
}

interface ChatStateContextProps {
    chatContext: ChatContextData | null;
    setChatContext: (data: ChatContextData | null) => void;
    openChat: () => void;
    isChatOpen: boolean;
    setIsChatOpen: (isOpen: boolean) => void;
}

const ChatStateContext = createContext<ChatStateContextProps | undefined>(undefined);

export function ChatStateProvider({ children }: { children: ReactNode }) {
    const [chatContext, setChatContext] = useState<ChatContextData | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const openChat = () => setIsChatOpen(true);

    return (
        <ChatStateContext.Provider value={{ chatContext, setChatContext, openChat, isChatOpen, setIsChatOpen }}>
            {children}
        </ChatStateContext.Provider>
    );
}

export function useChatState() {
    const context = useContext(ChatStateContext);
    if (!context) {
        throw new Error("useChatState must be used within a ChatStateProvider");
    }
    return context;
}
