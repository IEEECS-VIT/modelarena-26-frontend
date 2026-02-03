"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { RiCheckLine, RiErrorWarningLine, RiCloseLine } from "react-icons/ri";

type ToastType = "success" | "error";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextProps {
    toast: {
        success: (message: string) => void;
        error: (message: string) => void;
    };
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const toast = {
        success: (message: string) => addToast(message, "success"),
        error: (message: string) => addToast(message, "error"),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed top-24 right-5 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              pointer-events-auto flex items-start gap-3 min-w-[300px] max-w-md p-4 
              bg-black/95 backdrop-blur-sm border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
              animate-in slide-in-from-right-full fade-in duration-300
              ${t.type === "success" ? "border-[#CCFF00]" : "border-red-500"}
            `}
                    >
                        <div className="mt-0.5">
                            {t.type === "success" ? (
                                <RiCheckLine className="w-5 h-5 text-[#CCFF00]" />
                            ) : (
                                <RiErrorWarningLine className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-sm font-bold tracking-wider mb-0.5 ${t.type === "success" ? "text-[#CCFF00]" : "text-red-500"}`}>
                                {t.type === "success" ? "SUCCESS" : "ERROR"}
                            </h4>
                            <p className="text-sm text-white/90 leading-relaxed font-mono">
                                {t.message}
                            </p>
                        </div>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-white/50 hover:text-white transition-colors"
                        >
                            <RiCloseLine className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
