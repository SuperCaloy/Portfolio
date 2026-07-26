import { createPortal } from 'react-dom';
import React, { useState, useEffect } from 'react';
const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

export default function ViewCertificateModal({ certificate, onClose, onEdit }) {
    const [showLightbox, setShowLightbox] = useState(false);

    if (!certificate) return null;
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                if (showLightbox) {
                    setShowLightbox(false);
                } else {
                    onClose();
                }
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [showLightbox, onClose]);

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/90 backdrop-blur-md overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{certificate.title}</h2>
                        <p className="text-base text-zinc-500 dark:text-zinc-400">{certificate.issuer}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {certificate.image_path && (
                    <img
                        src={certificate.image_path}
                        alt={certificate.title}
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-zoom-in"
                        onClick={() => setShowLightbox(true)}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-zinc-500 dark:text-zinc-400">Issued</p>
                        <p className="font-mono text-zinc-800 dark:text-zinc-200">{formatDate(certificate.issue_date)}</p>
                    </div>
                    {certificate.expiration_date && (
                        <div>
                            <p className="text-zinc-500 dark:text-zinc-400">Expires</p>
                            <p className="font-mono text-zinc-800 dark:text-zinc-200">{formatDate(certificate.expiration_date)}</p>
                        </div>
                    )}
                </div>

                {certificate.credential_id && (
                    <div className="text-sm">
                        <p className="text-zinc-500 dark:text-zinc-400">Credential ID</p>
                        <p className="font-mono text-zinc-800 dark:text-zinc-200">{certificate.credential_id}</p>
                    </div>
                )}

                {certificate.credential_url && (
                    <a
                        href={certificate.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        Verify Credential
                    </a>
                )}

                {onEdit && (
                    <div className="flex justify-end pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => onEdit(certificate)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-medium"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>

            {showLightbox && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90"
                    onClick={(e) => { e.stopPropagation(); setShowLightbox(false); }}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowLightbox(false); }}
                        className="absolute top-4 right-4 p-2 rounded-md text-white hover:bg-white/10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={certificate.image_path}
                        alt={certificate.title}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>,
        document.body
    );
}