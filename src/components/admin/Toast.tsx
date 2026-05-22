"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

// Hook to trigger toasts from any child component
export const useToast = () => useContext(ToastContext);

// Font Awesome icon per toast type
const icons: Record<ToastType, string> = {
  success: "fa-check-circle",
  error: "fa-exclamation-circle",
  info: "fa-info-circle",
  warning: "fa-exclamation-triangle",
};

// Gradient background per toast type
const gradients: Record<ToastType, string> = {
  success: "linear-gradient(135deg, #43e97b, #38f9d7)",
  error: "linear-gradient(135deg, #f5576c, #ff6f91)",
  info: "linear-gradient(135deg, #667eea, #764ba2)",
  warning: "linear-gradient(135deg, #f093fb, #f5576c)",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a toast and auto-remove after 4 seconds
  const toast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast-item" style={{ background: gradients[t.type] }}>
            <i className={`fas ${icons[t.type]}`} />
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
              <i className="fas fa-times" />
            </button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }
        .toast-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 14px;
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
          font-family: "DM Sans", sans-serif;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          pointer-events: auto;
          animation: slideIn 0.3s ease, fadeOut 0.3s ease 3.7s forwards;
          max-width: 420px;
          backdrop-filter: blur(10px);
        }
        .toast-item i { font-size: 1.1rem; flex-shrink: 0; }
        .toast-item span { flex: 1; }
        .toast-close {
          background: none; border: none; color: rgba(255,255,255,0.7);
          cursor: pointer; padding: 0; font-size: 0.9rem;
        }
        .toast-close:hover { color: #fff; }
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateX(40px); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
