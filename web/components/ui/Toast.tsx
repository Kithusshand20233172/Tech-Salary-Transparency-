'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const bgColor = {
        success: 'bg-zinc-900 border-zinc-800',
        error: 'bg-red-600 border-red-500',
        info: 'bg-zinc-700 border-zinc-600',
    }[type];

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center px-6 py-3 border rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 ${bgColor} text-white`}>
            <span className="text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="ml-4 hover:opacity-70 transition-opacity"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};
