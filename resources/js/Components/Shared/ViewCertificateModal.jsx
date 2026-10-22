import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import Lightbox from '../Shared/Lightbox';
import { optimizeCloudinaryUrl } from '../../utils/image';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function ViewCertificateModal({ certificate, onClose, onEdit }) {
    const [showLightbox, setShowLightbox] = useState(false);

    return (
        <Modal
            id="certModal"
            isOpen={!!certificate}
            onClose={onClose}
            onEscape={() => (showLightbox ? setShowLightbox(false) : onClose())}
            maxWidth="max-w-2xl"
            ariaLabel={certificate?.title || 'Certificate details'}
            title={certificate?.title}
        >
            {certificate && (
                <div className="p-6 space-y-4">
                    <p className="text-base font-semibold text-emerald-400">{certificate.issuer}</p>

                    {certificate.image_path ? (
                        <img
                            src={optimizeCloudinaryUrl(certificate.image_path, 1200)}
                            alt={certificate.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full max-h-[50vh] object-contain rounded-xl shadow-2xl shadow-black/60 ring-1 ring-white/10 cursor-zoom-in bg-[#0a0a0a]"
                            onClick={() => setShowLightbox(true)}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-full py-8 px-6 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <span className="font-mono text-xs text-zinc-300 uppercase tracking-wider">Accredited Academic &amp; Industry Credential</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm pt-1">
                        <div>
                            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Issued</p>
                            <p className="font-mono font-medium text-white">{formatDate(certificate.issue_date)}</p>
                        </div>
                        {certificate.expiration_date && (
                            <div>
                                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Expires</p>
                                <p className="font-mono font-medium text-white">{formatDate(certificate.expiration_date)}</p>
                            </div>
                        )}
                    </div>

                    {certificate.credential_id && (
                        <div className="text-sm">
                            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Credential ID</p>
                            <p className="font-mono text-white tracking-wide">{certificate.credential_id}</p>
                        </div>
                    )}

                    {certificate.credential_url && (
                        <div className="pt-2">
                            <a
                                href={certificate.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                <span>Verify Credential</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    )}

                    {onEdit && (
                        <div className="flex justify-end pt-3 border-t border-white/10">
                            <button
                                onClick={() => onEdit(certificate)}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-semibold transition-all"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            )}

            {certificate && (
                <Lightbox
                    isOpen={showLightbox}
                    onClose={() => setShowLightbox(false)}
                    src={optimizeCloudinaryUrl(certificate.image_path, 1920)}
                    alt={certificate.title}
                />
            )}
        </Modal>
    );
}