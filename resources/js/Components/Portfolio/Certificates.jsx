import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ViewCertificateModal from '../Shared/ViewCertificateModal';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

function CertificateCard({ cert, onSelect }) {
    return (
        <button
            onClick={() => onSelect(cert)}
            className="group p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between text-left w-full"
        >
            <div>
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                    {cert.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">{cert.issuer}</p>
                <span className="inline-block text-[11px] font-mono text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                    View details →
                </span>
            </div>
            <span className="text-xs font-mono text-zinc-500 shrink-0">{formatDate(cert.issue_date)}</span>
        </button>
    );
}

export default function Certificates({ certificates = [] }) {
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Latest first, fallback to 0 if issue_date missing
    const sortedCertificates = [...certificates].sort((a, b) => {
        return new Date(b.issue_date || 0) - new Date(a.issue_date || 0);
    });
    const displayCertificates = sortedCertificates.slice(0, 6);

    useEffect(() => {
        if (!showModal) return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [showModal]);

    if (certificates.length === 0) return null;

    return (
        <section id="certificates" className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                    Certifications
                </h2>
                <span className="text-sm text-zinc-500 dark:text-zinc-600 font-mono">{displayCertificates.length} shown</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayCertificates.map((cert) => (
                    <CertificateCard key={cert.id ?? cert.title} cert={cert} onSelect={setSelectedCertificate} />
                ))}
            </div>

            {sortedCertificates.length > displayCertificates.length && (
                <button
                    onClick={() => setShowModal(true)}
                    className="text-sm font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors underline underline-offset-4"
                >
                    View All Certificates ({sortedCertificates.length})
                </button>
            )}

            {showModal && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto styled-scrollbar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">All Certificates</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {sortedCertificates.map((cert) => (
                                <CertificateCard key={cert.id ?? cert.title} cert={cert} onSelect={setSelectedCertificate} />
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {selectedCertificate && (
                <ViewCertificateModal
                    certificate={selectedCertificate}
                    onClose={() => setSelectedCertificate(null)}
                />
            )}
        </section>
    );
}