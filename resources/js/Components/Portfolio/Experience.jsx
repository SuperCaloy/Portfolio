import React from 'react';

const formatDate = (dateString) => {
    if (!dateString) return '';
    // Takes the 'YYYY-MM-DD' part before the 'T'
    return dateString.split('T')[0];
};

export default function Experience({ experiences = [] }) {
    if (experiences.length === 0) return null;

    return (
        <section id="experience" className="space-y-6">
            <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                Work Experience
            </h2>

            <div className="space-y-6 border-l border-zinc-200/80 dark:border-zinc-800/80 pl-4 ml-1">
                {experiences.map((exp) => (
                    <div key={exp.id ?? exp.company} className="relative space-y-1.5">
                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-700 border border-white dark:border-zinc-950" />

                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {exp.role || exp.title} <span className="text-zinc-500 font-normal">at {exp.company}</span>
                            </h3>
                            <span className="text-xs font-mono text-zinc-500">
                                {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                            </span>
                        </div>

                        {exp.description && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {exp.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}