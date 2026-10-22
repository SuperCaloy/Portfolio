import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Full screen image zoom overlay. Renders above the parent Modal's z-index.
// Stops propagation on the image itself so clicking the image does not close it.
export default function Lightbox({ isOpen, onClose, src, alt }) {
    const closeBtnRef = useRef(null);
    const prevActiveElement = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        prevActiveElement.current = document.activeElement;
        closeBtnRef.current?.focus();

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
            } else if (e.key === 'Tab') {
                // Trap focus on the close button (the only interactive control)
                e.preventDefault();
                closeBtnRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown, true);
            if (prevActiveElement.current && document.contains(prevActiveElement.current)) {
                prevActiveElement.current.focus();
            }
        };
    }, [isOpen, onClose]);

    if (!isOpen || typeof document === 'undefined') return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={alt ? `Image preview: ${alt}` : 'Image preview'}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 focus:outline-none"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
            <button
                ref={closeBtnRef}
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-full text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                aria-label="Close image preview"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain rounded-lg select-none"
                onClick={(e) => e.stopPropagation()}
            />
        </div>,
        document.body
    );
}