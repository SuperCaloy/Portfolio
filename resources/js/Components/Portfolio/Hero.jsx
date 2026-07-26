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
            className={`pt-4 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
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

                    <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed max-w-2xl font-normal">
                        {bio}
                    </p>

                    {stats && (stats.projects > 0 || stats.experienceLabel || stats.certificates > 0) && (
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-mono text-zinc-500 dark:text-zinc-400">
                            {stats.projects > 0 && (
                                <span>{stats.projects} Project{stats.projects > 1 ? 's' : ''}</span>
                            )}
                            {stats.experienceLabel && (
                                <span>{stats.experienceLabel}</span>
                            )}
                            {stats.certificates > 0 && (
                                <span>{stats.certificates} Certification{stats.certificates > 1 ? 's' : ''}</span>
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                        >
                            <svg className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Contact Me</span>
                        </button>

                        {personal?.github_url && (
                            <a
                                href={personal.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-medium transition-all"
                            >
                                <span>GitHub</span>
                                <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}

                        {personal?.linkedin_url && (
                            <a
                                href={personal.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-medium transition-all"
                            >
                                <span>LinkedIn</span>
                                <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}

                        {personal?.resume_path && (
                            <a
                                href="/resume"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-medium transition-all"
                            >
                                <span>Resume</span>
                                <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>

                {personal?.avatar_path && (
                    <div className="shrink-0 self-center md:self-start w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <img src={personal.avatar_path} alt={name} className="w-full h-full object-cover" />
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