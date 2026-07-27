import React, { useState } from 'react';
import ViewExperienceModal from '../Shared/ViewExperienceModal';
import useInView from '../../hooks/useInView';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function Experience({ experiences = [] }) {
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [sectionRef, isInView] = useInView();

    if (experiences.length === 0) return null;

    return (
        <section
            id="experience"
            ref={sectionRef}
            className={`space-y-6 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                Work Experience
            </h2>

            <div className="space-y-6 border-l border-zinc-200/80 dark:border-zinc-800/80 pl-4 ml-1">
                {experiences.map((exp) => (
                    <button
                        key={exp.id ?? exp.company}
                        onClick={() => setSelectedExperience(exp)}
                        className="group relative space-y-1.5 text-left w-full p-2 -ml-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:-translate-y-0.5 hover:shadow-sm transition-all"
                    >
                        <div className="absolute -left-[25px] top-3.5 w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-700 border border-white dark:border-zinc-950 group-hover:bg-zinc-600 dark:group-hover:bg-zinc-400 transition-colors" />

                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                {exp.role || exp.title} <span className="text-zinc-500 font-normal">at {exp.company}</span>
                            </h3>
                            <span className="text-sm font-mono font-medium text-zinc-600 dark:text-zinc-300">
                                {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                            </span>
                        </div>

                        {exp.description && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {exp.description}
                            </p>
                        )}

                        <span className="inline-block text-xs font-mono text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            View details →
                        </span>
                    </button>
                ))}
            </div>

            {selectedExperience && (
                <ViewExperienceModal
                    experience={selectedExperience}
                    onClose={() => setSelectedExperience(null)}
                />
            )}
        </section>
    );
}