import React from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmModal({ title, message, onConfirm, onCancel, danger = false }) {
    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md"
            onClick={onCancel}
        >
            <div
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-1.5">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">{title}</h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                            danger
                                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950'
                        }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}