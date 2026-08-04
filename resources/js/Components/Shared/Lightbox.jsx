import React from 'react';
import { createPortal } from 'react-dom';

// Full screen image zoom overlay. Renders above the parent Modal's z-index.
// Stops propagation on the image itself so clicking the image does not close it.
export default function Lightbox({ isOpen, onClose, src, alt }) {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 p-2 rounded-md text-white hover:bg-white/10"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
            />
        </div>,
        document.body
    );
}