'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colors = {
    success: { bg: 'var(--success-light)', border: 'var(--success)', text: 'var(--success)' },
    error: { bg: 'var(--danger-light)', border: 'var(--danger)', text: 'var(--danger)' },
    warning: { bg: 'var(--warning-light)', border: 'var(--warning)', text: '#92400e' },
    info: { bg: 'var(--info-light)', border: 'var(--info)', text: 'var(--info)' },
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const Icon = icons[toast.type];
    const color = colors[toast.type];

    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, toast.duration || 4000);
        return () => clearTimeout(timer);
    }, [toast.duration, onClose]);

    return (
        <div
            className="animate-slide-up"
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                background: color.bg,
                border: `1px solid ${color.border}`,
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                maxWidth: 400,
                minWidth: 300,
            }}
        >
            <Icon size={20} style={{ color: color.text, flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1, color: color.text, fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                {toast.message}
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: color.text,
                    opacity: 0.6,
                }}
            >
                <X size={16} />
            </button>
        </div>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {/* Toast Container */}
            <div
                style={{
                    position: 'fixed',
                    top: 'var(--space-6)',
                    right: 'var(--space-6)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                }}
            >
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() => hideToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
