import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const STATUS_STYLES = {
    'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    'Archived': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

export default function ViewProjectModal({ project, onClose, onEdit }) {
    const [showLightbox, setShowLightbox] = useState(false);

    if (!project) return null;

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
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <div className="space-y-1.5">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{project.title}</h2>
                        {project.status && (
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[project.status] || STATUS_STYLES['Archived']}`}>
                                {project.status}
                            </span>
                        )}
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

                {project.image_path && (
                    <img
                        src={project.image_path}
                        alt={project.title}
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-zoom-in"
                        onClick={() => setShowLightbox(true)}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                )}

                {project.subtitle && (
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {project.subtitle}
                    </p>
                )}

                {project.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                        {project.description}
                    </p>
                )}

                {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.map((tech, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-xs"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {project.github_url && (
                        <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Code
                        </a>
                    )}

                    {project.demo_url && (
                        <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            Live Preview
                        </a>
                    )}
                </div>

                {onEdit && (
                    <div className="flex justify-end pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => onEdit(project)}
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
                        src={project.image_path}
                        alt={project.title}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>,
        document.body
    );
}