"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Icons } from "../Icons";

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: { bg: "bg-green-50 border-green-200", text: "text-green-800", icon: Icons.check },
  error: { bg: "bg-red-50 border-red-200", text: "text-red-800", icon: Icons.alert },
  info: { bg: "bg-blue-50 border-blue-200", text: "text-blue-800", icon: Icons.sparkle },
  warning: { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", icon: Icons.alert },
  ai: { bg: "bg-purple-50 border-purple-200", text: "text-purple-800", icon: Icons.sparkle },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-up min-w-[280px] max-w-[420px] ${style.bg}`}
            >
              <span className={`flex-shrink-0 ${style.text}`}>{style.icon}</span>
              <p className={`text-[13px] font-medium leading-snug flex-1 ${style.text}`}>{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className={`flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ${style.text}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
