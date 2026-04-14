'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const widths = {
        sm: 360,
        md: 480,
        lg: 640,
    };

    return (
        <div
            ref={overlayRef}
            onClick={(e) => e.target === overlayRef.current && onClose()}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9998,
                padding: 'var(--space-4)',
            }}
        >
            <div
                className="animate-slide-up"
                style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-xl)',
                    width: '100%',
                    maxWidth: widths[size],
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-4) var(--space-5)',
                        borderBottom: '1px solid var(--color-border)',
                    }}
                >
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        className="btn btn-icon btn-ghost btn-sm"
                        style={{ marginRight: '-8px' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: 'var(--space-5)', overflow: 'auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

// Prompt Modal - replacement for window.prompt()
interface PromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value: string) => void;
    title: string;
    message?: string;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
}

export function PromptModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    placeholder = '',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: PromptModalProps) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen) {
            setValue('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (value.trim()) {
            onConfirm(value.trim());
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
            {message && (
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                    {message}
                </p>
            )}
            <textarea
                ref={inputRef}
                className="form-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={3}
                style={{ resize: 'vertical', marginBottom: 'var(--space-4)' }}
            />
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={onClose}>
                    {cancelText}
                </button>
                <button className="btn btn-primary" onClick={handleConfirm} disabled={!value.trim()}>
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}

// Confirm Modal - replacement for window.confirm()
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const buttonClass = variant === 'danger' ? 'btn-danger' : variant === 'warning' ? 'btn-warning' : 'btn-primary';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)', lineHeight: 1.6 }}>
                {message}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={onClose}>
                    {cancelText}
                </button>
                <button className={`btn ${buttonClass}`} onClick={handleConfirm}>
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}
