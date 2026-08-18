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
            isOpen={!!certificate}
            onClose={onClose}
            onEscape={() => (showLightbox ? setShowLightbox(false) : onClose())}
            maxWidth="max-w-2xl"
            ariaLabel={certificate?.title || 'Certificate details'}
            title={certificate?.title}
        >
            {certificate && (
                <div className="p-6 space-y-4">
                    <p className="text-base font-medium text-zinc-500 dark:text-zinc-400">{certificate.issuer}</p>

                    {certificate.image_path && (
                        <img
                            src={optimizeCloudinaryUrl(certificate.image_path, 1200)}
                            alt={certificate.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full max-h-[50vh] object-contain rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10 cursor-zoom-in bg-white dark:bg-[#0a0a0a]"
                            onClick={() => setShowLightbox(true)}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-zinc-500 dark:text-zinc-400">Issued</p>
                            <p className="font-mono font-medium text-zinc-800 dark:text-zinc-200">{formatDate(certificate.issue_date)}</p>
                        </div>
                        {certificate.expiration_date && (
                            <div>
                                <p className="text-zinc-500 dark:text-zinc-400">Expires</p>
                                <p className="font-mono font-medium text-zinc-800 dark:text-zinc-200">{formatDate(certificate.expiration_date)}</p>
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