import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Shared modal shell. Handles backdrop, scroll lock, escape key, focus trap,
// and entry animation so every modal in the app behaves identically.
export default function Modal({ isOpen, onClose, onEscape, children, maxWidth = 'max-w-2xl', ariaLabel }) {
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/90 backdrop-blur-md overflow-y-auto [transform:translateZ(0)] [will-change:backdrop-filter]"
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
                aria-label={ariaLabel}
                className={`bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full ${maxWidth} max-h-[85vh] overflow-y-auto styled-scrollbar shadow-soft-lg animate-[modalIn_0.18s_ease-out]`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}