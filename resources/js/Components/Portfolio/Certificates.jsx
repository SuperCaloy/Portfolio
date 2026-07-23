import React from 'react';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

export default function Certificates({ certificates = [] }) {
    if (certificates.length === 0) return null;

    return (
        <section id="certificates" className="space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                Certifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certificates.map((cert) => (
                    <div
                        key={cert.id ?? cert.title}
                        className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between"
                    >
                        <div>
                            <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{cert.title}</h3>
                            <p className="text-[11px] text-zinc-500 mt-0.5">{cert.issuer}</p>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500">{formatDate(cert.issue_date)}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}