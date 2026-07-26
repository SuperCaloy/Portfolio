import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

export default function ViewExperienceModal({ experience, onClose, onEdit }) {
    if (!experience) return null;
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);
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
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                            {experience.role || experience.title}
                        </h2>
                        <p className="text-base text-zinc-500 dark:text-zinc-400">
                            {experience.company}
                            {experience.location && ` · ${experience.location}`}
                        </p>
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

                <p className="text-sm font-mono text-zinc-500">
                    {formatDate(experience.start_date)} — {experience.end_date ? formatDate(experience.end_date) : 'Present'}
                </p>

                {experience.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                        {experience.description}
                    </p>
                )}

                {experience.achievements && Array.isArray(experience.achievements) && experience.achievements.length > 0 && (
                    <div className="space-y-1.5">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Key Achievements</p>
                        <ul className="space-y-1">
                            {experience.achievements.map((item, idx) => (
                                <li key={idx} className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-2">
                                    <span className="text-zinc-400 dark:text-zinc-600 shrink-0">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {onEdit && (
                    <div className="flex justify-end pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => onEdit(experience)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-medium"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}