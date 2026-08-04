import React, { useState, useEffect } from 'react';
import Modal from '../Shared/Modal';
import ViewCertificateModal from '../Shared/ViewCertificateModal';
import useInView from '../../hooks/useInView';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Picks a column count that divides evenly into the item count so no
// row is ever left with a lone card and empty gaps beside it. Falls
// back to 3 columns for counts that do not divide cleanly, e.g. 5 or 7.
function certGridCols(count) {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count % 3 === 0) return 'grid-cols-1 sm:grid-cols-3';
    if (count % 2 === 0) return 'grid-cols-1 sm:grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
}

function CertificateCard({ cert, onSelect }) {
    return (
        <button
            onClick={() => onSelect(cert)}
            className="group p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:shadow-soft hover:-translate-y-0.5 transition-all text-left w-full space-y-1"
        >
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                {cert.title}
            </h3>
            <div className="flex items-center gap-2 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">{cert.issuer}</span>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span className="font-mono font-medium text-zinc-600 dark:text-zinc-300">{formatDate(cert.issue_date)}</span>
            </div>
            <span className="inline-block text-xs font-mono text-zinc-400 dark:text-zinc-600 opacity-60 group-hover:opacity-100 transition-opacity">
                View details →
            </span>
        </button>
    );
}

export default function Certificates({ certificates = [] }) {
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sectionRef, isInView] = useInView();

    // Latest first, fallback to 0 if issue_date missing
    const sortedCertificates = [...certificates].sort((a, b) => {
        return new Date(b.issue_date || 0) - new Date(a.issue_date || 0);
    });
    const displayCertificates = sortedCertificates.slice(0, 6);

    if (certificates.length === 0) return null;

    return (
        <section
            id="certificates"
            ref={sectionRef}
            className={`space-y-4 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                    Certifications
                </h2>
                <span className="text-sm text-zinc-500 dark:text-zinc-600 font-mono">{displayCertificates.length} shown</span>
            </div>

           <div className={`grid ${certGridCols(displayCertificates.length)} gap-3`}>
                {displayCertificates.map((cert, idx) => (
                    <CertificateCard key={`cert-${cert.id ?? cert.title ?? 'unknown'}-${idx}`} cert={cert} onSelect={setSelectedCertificate} />
                ))}
            </div>

            {sortedCertificates.length > displayCertificates.length && (
                <button
                    onClick={() => setShowModal(true)}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-medium transition-all"
                >
                    <span>View All Certificates</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} maxWidth="max-w-4xl" ariaLabel="All Certificates">
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

                <div className={`p-6 grid ${certGridCols(sortedCertificates.length)} gap-3`}>
                    {sortedCertificates.map((cert, idx) => (
                        <CertificateCard key={`cert-all-${cert.id ?? cert.title ?? 'unknown'}-${idx}`} cert={cert} onSelect={setSelectedCertificate} />
                    ))}
                </div>
            </Modal>

            {selectedCertificate && (
                <ViewCertificateModal
                    certificate={selectedCertificate}
                    onClose={() => setSelectedCertificate(null)}
                />
            )}
        </section>
    );
}