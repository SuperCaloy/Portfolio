import React, { useState } from 'react';
import ContactModal from './ContactModal';
import useInView from '../../hooks/useInView';

export default function Hero({ personal, stats }) {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [sectionRef, isInView] = useInView();

    const name = personal?.full_name || 'Your Name';
    const title = personal?.professional_title || 'Software Engineer';
    const bio = personal?.bio || personal?.about_me || 'Passionate engineer creating clean, high-performance web applications and digital tools.';

    return (
        <section
            id="about"
            ref={sectionRef}
            className={`pt-4 transition-all duration-700 ease-fluid ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            <div className="flex flex-col-reverse md:flex-row items-stretch md:items-start justify-between gap-8">
                <div className="space-y-6 min-w-0">
                    <div className="space-y-3">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {name}
                        </h1>
                        <p className="text-lg sm:text-xl font-medium text-zinc-600 dark:text-zinc-400">
                            {title}
                        </p>
                    </div>

                    <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed max-w-xl font-normal">
                        {bio}
                    </p>

                    {stats && (stats.projects > 0 || stats.experienceLabel || stats.certificates > 0) && (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            {stats.projects > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900/60 font-mono text-zinc-600 dark:text-zinc-400">
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.projects}</span>
                                    Project{stats.projects > 1 ? 's' : ''}
                                </span>
                            )}
                            {stats.experienceLabel && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900/60 font-mono text-zinc-600 dark:text-zinc-400">
                                    {stats.experienceLabel}
                                </span>
                            )}
                            {stats.certificates > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900/60 font-mono text-zinc-600 dark:text-zinc-400">
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.certificates}</span>
                                    Certification{stats.certificates > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all duration-500 ease-fluid shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                            <span>Contact Me</span>
                            <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 transition-transform duration-500 ease-fluid">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                        </button>

                        {personal?.github_url && (
                            <a
                                href={personal.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-medium active:scale-95 transition-all"
                            >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.58 2 12.17c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.74 0 0 .84-.28 2.75 1.05a9.3 9.3 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.43.2 2.48.1 2.74.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.5A10.02 10.02 0 0022 12.17C22 6.58 17.52 2 12 2z" />
                                </svg>
                                <span>GitHub</span>
                            </a>
                        )}

                        {personal?.linkedin_url && (
                            <a
                                href={personal.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-medium active:scale-95 transition-all"
                            >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                                </svg>
                                <span>LinkedIn</span>
                            </a>
                        )}

                        {personal?.resume_path && (
                            <a
                                href="/resume"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-medium active:scale-95 transition-all"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Resume</span>
                            </a>
                        )}
                    </div>
                </div>

                {personal?.avatar_path && (
                    <div className="shrink-0 self-center md:self-start w-[7.5rem] h-[7.5rem] sm:w-[9.75rem] sm:h-[9.75rem] md:w-[11.75rem] md:h-[11.75rem] p-1.5 rounded-[1.75rem] bg-zinc-100 dark:bg-zinc-900/60 ring-1 ring-emerald-500/30 dark:ring-emerald-500/20 shadow-soft">
                        <div className="w-full h-full rounded-[1.375rem] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                            <img src={personal.avatar_path} alt={`${name}, profile photo`} className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
            </div>

            <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </section>
    );
}