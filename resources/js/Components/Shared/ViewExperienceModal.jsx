import React from 'react';
import Modal from '../Shared/Modal';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function ViewExperienceModal({ experience, onClose, onEdit }) {
    return (
        <Modal
            id="experienceModal"
            isOpen={!!experience}
            onClose={onClose}
            maxWidth="max-w-2xl"
            ariaLabel={experience?.role || experience?.title || 'Experience details'}
            title={experience?.role || experience?.title}
        >
            {experience && (
                <div className="p-6 space-y-4">
                    <p className="text-base font-semibold text-emerald-400">
                        {experience.company}
                        {experience.location && (
                            <span className="text-zinc-400 font-normal"> · {experience.location}</span>
                        )}
                    </p>

                    <p className="text-xs font-mono font-medium text-zinc-300">
                        {formatDate(experience.start_date)} to {experience.end_date ? formatDate(experience.end_date) : 'Present'}
                    </p>

                    {experience.description && (
                        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {experience.description}
                        </p>
                    )}

                    {experience.achievements && Array.isArray(experience.achievements) && experience.achievements.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-white/10">
                            <p className="text-xs font-mono uppercase tracking-wider font-semibold text-emerald-400">Key Achievements</p>
                            <ul className="space-y-1.5">
                                {experience.achievements.map((item, idx) => (
                                    <li key={idx} className="text-sm text-zinc-300 flex gap-2.5">
                                        <span className="text-emerald-400 shrink-0 font-bold">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {onEdit && (
                        <div className="flex justify-end pt-3 border-t border-white/10">
                            <button
                                onClick={() => onEdit(experience)}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-semibold transition-all"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}