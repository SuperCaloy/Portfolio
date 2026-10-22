import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Shared modal shell. Handles backdrop, scroll lock, escape key, focus trap,
// and entry animation so every modal in the app behaves identically.
export default function Modal({
    id,
    isOpen,
    onClose,
    onEscape,
    children,
    maxWidth = 'max-w-2xl',
    ariaLabel,
    title,
    bodyClassName = '',
}) {
    const modalRef = useRef(null);
    const previouslyFocused = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const active = document.activeElement;
        if (active && active !== document.body) {
            previouslyFocused.current = active;
        }

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
        window.lenis?.stop();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            const toFocus = previouslyFocused.current;
            if (toFocus && typeof toFocus.focus === 'function' && document.contains(toFocus)) {
                setTimeout(() => {
                    if (document.contains(toFocus)) {
                        toFocus.focus();
                    }
                }, 10);
            }
            window.lenis?.start();
        };
    }, [isOpen, onClose, onEscape]);

    if (typeof document === 'undefined') return null;
    if (!isOpen && !id) return null;

    return createPortal(
        <div
            id={id}
            data-lenis-prevent
            aria-hidden={!isOpen}
            className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden [transform:translateZ(0)] transition-all duration-300 ${
                isOpen ? 'active opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none hidden'
            }`}
            onClick={onClose}
        >
            {isOpen && (
                <>
                    <style>{`
                        @keyframes modalIn {
                            from { opacity: 0; transform: scale(0.96) translateY(8px); }
                            to { opacity: 1; transform: scale(1) translateY(0); }
                        }
                    `}</style>
                    <div
                        ref={modalRef}
                        data-lenis-prevent
                        role="dialog"
                        aria-modal="true"
                        aria-label={ariaLabel || title}
                        className={`bg-[#121216] border border-white/15 rounded-2xl sm:rounded-3xl w-full ${maxWidth} max-h-[90dvh] sm:max-h-[85vh] overflow-hidden shadow-2xl shadow-black/90 ring-1 ring-white/10 animate-[modalIn_0.22s_cubic-bezier(0.16,1,0.3,1)] flex flex-col text-white`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {title && (
                            <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 bg-[#121216] border-b border-white/10">
                                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-1 sm:-mr-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <div className={`relative z-10 flex-1 min-h-0 ${bodyClassName || 'overflow-y-auto styled-scrollbar p-6'}`}>
                            {children}
                        </div>
                    </div>
                </>
            )}
        </div>,
        document.body
    );
}