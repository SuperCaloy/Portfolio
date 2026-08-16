import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Shared modal shell. Handles backdrop, scroll lock, escape key, focus trap,
// and entry animation so every modal in the app behaves identically.
export default function Modal({ isOpen, onClose, onEscape, children, maxWidth = 'max-w-2xl', ariaLabel, title }) {
    const modalRef = useRef(null);
    const previouslyFocused = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        previouslyFocused.current = document.activeElement;
        const focusable = modalRef.current?.querySelectorAll('input, textarea, button, a[href], [tabindex]:not([tabindex="-1"])');
        (focusable?.[0] || modalRef.current)?.focus();

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                (onEscape || onClose)();
                return;
            }
            // Focus trap, keeps Tab navigation inside the modal
            if (e.key === 'Tab' && modalRef.current) {
                const items = modalRef.current.querySelectorAll('input, textarea, button, a[href], [tabindex]:not([tabindex="-1"])');
                if (items.length === 0) return;
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            previouslyFocused.current?.focus?.();
        };
    }, [isOpen, onClose, onEscape]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/40 backdrop-blur-sm overflow-y-auto [transform:translateZ(0)] [will-change:backdrop-filter]"
            onClick={onClose}
        >
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.97) translateY(4px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel || title}
                className={`bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl w-full ${maxWidth} max-h-[85vh] overflow-y-auto styled-scrollbar shadow-2xl shadow-black/10 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/5 animate-[modalIn_0.18s_ease-out] flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            aria-label="Close modal"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="relative z-10 flex-1">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}