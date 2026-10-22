import React, { useState, lazy, Suspense } from 'react';
import { formatMonthYear as formatDate } from '../../utils/date';

const ViewExperienceModal = lazy(() => import('../Shared/ViewExperienceModal'));

export default function Experience({ experiences = [] }) {
    const [selectedExperience, setSelectedExperience] = useState(null);

    if (experiences.length === 0) return null;

    return (
        <section
            id="experience"
            className="exp-sec relative z-10 py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto w-full"
            aria-label="Work Experience"
        >
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <h2
                    className="font-black uppercase text-3xl sm:text-5xl md:text-6xl text-white tracking-tight"
                    style={{ fontFamily: "'Kanit', sans-serif" }}
                >
                    Work Experience
                </h2>
            </div>

            {/* Minimalist Timeline List with Circuit Spine */}
            <div className="relative pl-6 sm:pl-10 space-y-6">
                <div className="timeline-spine absolute left-2.5 sm:left-4 top-8 bottom-8 w-[2px] bg-gradient-to-b from-emerald-500 via-emerald-500/30 to-transparent pointer-events-none" />
                {experiences.map((exp, idx) => (
                    <article
                        key={exp.id ?? `${exp.company}-${idx}`}
                        className="exp-card exp-shell relative rounded-[20px] p-6 sm:p-8 bg-[#121216] border border-white/10 hover:border-emerald-500/40 shadow-lg transition-all duration-300 group hover:-translate-y-1 flex flex-col sm:flex-row gap-5 sm:gap-8 justify-between items-start"
                    >
                        {/* Timeline Node Anchor */}
                        <div className="timeline-spine-node timeline-node absolute -left-6 sm:-left-10 top-7 w-3.5 h-3.5 rounded-full bg-[#121216] border-2 border-emerald-400 flex items-center justify-center group-hover:border-emerald-300 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.9)] transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>

                        <div className="shrink-0 sm:w-52">
                            <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                                {formatDate(exp.start_date)} to {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                            </span>
                            {exp.location && (
                                <p className="text-xs font-mono text-zinc-400 tracking-wide mt-1">
                                    {exp.location}
                                </p>
                            )}
                        </div>

                        <div className="flex-1 space-y-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                {exp.role || exp.title}{' '}
                                <span className="text-zinc-400 font-normal">at {exp.company}</span>
                            </h3>

                            {exp.description && (
                                <p className="text-sm text-zinc-300 font-normal leading-relaxed line-clamp-3">
                                    {exp.description}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => setSelectedExperience(exp)}
                                className="exp-trigger-btn pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold hover:text-emerald-300 transition-colors cursor-pointer text-left after:absolute after:inset-0 after:content-[''] after:cursor-pointer after:z-[1] focus:outline-none"
                            >
                                <span>View role specifications</span>
                                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform relative z-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {selectedExperience && (
                <Suspense fallback={null}>
                    <ViewExperienceModal
                        experience={selectedExperience}
                        onClose={() => setSelectedExperience(null)}
                    />
                </Suspense>
            )}
        </section>
    );
}