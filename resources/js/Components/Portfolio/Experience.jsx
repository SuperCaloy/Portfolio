import React, { useState } from 'react';
import ViewExperienceModal from '../Shared/ViewExperienceModal';
import useInView from '../../hooks/useInView';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

function AnimatedItem({ children, index = 0 }) {
    const [ref, isInView] = useInView();
    // UI/UX Pro Max: 50ms stagger per item, faster duration, subtle distance
    return (
        <div 
            ref={ref} 
            className={`transition-all duration-700 ease-fluid ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * 50}ms` }}
        >
            {children}
        </div>
    );
}

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

            <div className="space-y-6">
                {experiences.map((exp, idx) => (
                    <AnimatedItem key={exp.id ?? exp.company} index={idx}>
                        <button
                            onClick={() => setSelectedExperience(exp)}
                            className="group w-full text-left p-1.5 sm:p-2 rounded-[2rem] bg-zinc-100/50 dark:bg-white/5 ring-1 ring-zinc-200/50 dark:ring-white/10 hover:ring-zinc-300 dark:hover:ring-white/20 hover:shadow-ambient hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-700 ease-fluid"
                        >
                            <div className="flex flex-col sm:flex-row gap-4 p-5 sm:p-8 rounded-[1.625rem] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                <div className="shrink-0 sm:w-48 pt-1">
                                    <span className="text-sm font-mono font-medium text-zinc-500 dark:text-zinc-400">
                                        {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                                    </span>
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {exp.role || exp.title} <span className="text-zinc-400 font-normal">at {exp.company}</span>
                                    </h3>

                                    {exp.description && (
                                        <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl text-pretty line-clamp-2">
                                            {exp.description}
                                        </p>
                                    )}

                                    <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 ease-fluid">
                                        View details
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </AnimatedItem>
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