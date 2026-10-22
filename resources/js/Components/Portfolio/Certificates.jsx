import React, { useState } from 'react';
import { formatMonthYear as formatDate } from '../../utils/date';
import Modal from '../Shared/Modal';
import ViewCertificateModal from '../Shared/ViewCertificateModal';

export default function Certificates({ certificates = [] }) {
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [showAllModal, setShowAllModal] = useState(false);

    if (certificates.length === 0) return null;

    const sortedCertificates = [...certificates].sort((a, b) => {
        return new Date(b.issue_date || 0) - new Date(a.issue_date || 0);
    });

    const displayCertificates = sortedCertificates.slice(0, 6);

    return (
        <section
            id="certificates"
            className="certs-sec relative z-10 py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto w-full"
            aria-label="Certifications & Accreditations"
        >
            <div id="certificate" className="absolute top-0 pointer-events-none" />
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 sm:mb-14">
                <div>
                    <h2
                        className="font-black uppercase text-3xl sm:text-5xl md:text-6xl text-white tracking-tight"
                        style={{ fontFamily: "'Kanit', sans-serif" }}
                    >
                        Certifications
                    </h2>
                </div>

                {sortedCertificates.length > 6 && (
                    <button
                        onClick={() => setShowAllModal(true)}
                        className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 min-h-[44px] rounded-full hover:bg-emerald-500 hover:text-black transition-all cursor-pointer select-none"
                    >
                        <span>View All Credentials ({sortedCertificates.length})</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Editorial Certificate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayCertificates.map((cert, idx) => (
                    <article
                        key={cert.id ?? `${cert.title}-${idx}`}
                        className="cert-card cert-shell relative rounded-[20px] p-6 bg-[#121214] border border-white/10 hover:border-emerald-500/40 shadow-lg transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between space-y-4 overflow-hidden"
                    >
                        {/* Subtle Ambient Watermark */}
                        <div className="cert-sheen absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/15 transition-all pointer-events-none" />

                        <div className="space-y-3 relative z-[1]">
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                                    {cert.issuer || 'Accredited Issuer'}
                                </span>
                                <span className="verify-beacon cert-beacon font-mono text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">
                                    VERIFIED
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                                {cert.title}
                            </h3>

                            <div className="font-mono text-xs text-zinc-400 space-y-1">
                                <p>ISSUED: {formatDate(cert.issue_date)}</p>
                                {cert.credential_id && (
                                    <p className="truncate">ID: {cert.credential_id}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedCertificate(cert)}
                            className="cert-trigger-btn pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold hover:text-emerald-300 transition-colors w-full cursor-pointer text-left after:absolute after:inset-0 after:content-[''] after:cursor-pointer after:z-[1] focus:outline-none"
                        >
                            <span>Inspect credential</span>
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform relative z-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </article>
                ))}
            </div>

            {/* Modals */}
            <ViewCertificateModal
                certificate={selectedCertificate}
                onClose={() => setSelectedCertificate(null)}
            />

            <Modal
                id="allCertsModal"
                isOpen={showAllModal}
                onClose={() => setShowAllModal(false)}
                maxWidth="max-w-4xl"
                title={`All Verified Certifications (${sortedCertificates.length})`}
                ariaLabel="All Certifications Archive"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
                    {sortedCertificates.map((cert, idx) => (
                        <div
                            key={cert.id ?? `all-${idx}`}
                            onClick={() => {
                                setShowAllModal(false);
                                setTimeout(() => {
                                    setSelectedCertificate(cert);
                                }, 50);
                            }}
                            className="p-4 rounded-xl bg-zinc-50 dark:bg-[#121216] border border-zinc-200/80 dark:border-white/10 hover:border-emerald-500/60 cursor-pointer group transition-all"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-wider">
                                    {cert.issuer}
                                </span>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    VERIFIED
                                </span>
                            </div>
                            <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-400 mb-1">
                                {cert.title}
                            </h4>
                            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                                Issued: {formatDate(cert.issue_date)}
                            </p>
                        </div>
                    ))}
                </div>
            </Modal>
        </section>
    );
}