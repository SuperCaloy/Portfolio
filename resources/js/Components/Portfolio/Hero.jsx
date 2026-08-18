import React, { useState } from 'react';
import useInView from '../../hooks/useInView';
import Modal from '../Shared/Modal';

export default function Hero({ personal, stats }) {
    const [sectionRef, isInView] = useInView();
    const [showAboutModal, setShowAboutModal] = useState(false);

    const name = personal?.full_name || 'Your Name';
    const title = personal?.professional_title || 'Software Engineer';
    const bio = personal?.bio || personal?.about_me || 'Passionate engineer creating clean, high-performance web applications and digital tools.';

    const hasPhoto = !!personal?.avatar_path;

    return (
        <section
            id="about"
            ref={sectionRef}
            className={`pt-24 sm:pt-32 pb-16 transition-all duration-1000 ease-fluid ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
            <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-12 lg:gap-20">
                <div className="w-full md:w-auto space-y-8 min-w-0 flex-1">
                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.05] text-balance">
                            {name}
                        </h1>
                        <p className="text-xl sm:text-2xl font-medium text-emerald-600 dark:text-emerald-400">
                            {title}
                        </p>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-2xl font-normal text-pretty">
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

                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <a
                            href="/contact"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                window.history.pushState({}, '', '/contact');
                            }}
                            className="group inline-flex items-center gap-4 pl-6 pr-2 py-3 md:py-2 rounded-full bg-emerald-600 text-white font-semibold text-base transition-all duration-700 ease-fluid shadow-[0_0_40px_-10px_rgba(5,150,105,0.4)] hover:shadow-[0_0_60px_-15px_rgba(5,150,105,0.6)] hover:bg-emerald-500 hover:-translate-y-1 active:scale-[0.98] no-underline ring-1 ring-white/20"
                        >
                            <span>Contact Me</span>
                            <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 transition-all duration-700 ease-fluid">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                        </a>

                        <button
                            onClick={() => setShowAboutModal(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-semibold active:scale-95 transition-all"
                        >
                            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>About Me</span>
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
                            <div className="inline-flex rounded-lg shadow-sm" role="group">
                                <a
                                    href="/resume"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-l-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-medium active:scale-95 transition-all"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Resume</span>
                                </a>
                                <a
                                    href="/resume?download=1"
                                    className="inline-flex items-center justify-center px-3 py-2.5 rounded-r-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-medium active:scale-95 transition-all"
                                    title="Download Resume"
                                    aria-label="Download Resume"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {hasPhoto && (
                    <div className="shrink-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-[20rem] lg:h-[20rem] p-2 rounded-[2rem] bg-zinc-100/50 dark:bg-white/5 ring-1 ring-zinc-200/50 dark:ring-white/10 shadow-ambient transition-transform duration-500 hover:scale-[1.02]">
                        <div className="w-full h-full rounded-[1.625rem] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
                            <img src={personal.avatar_path} alt={`${name}, profile photo`} fetchPriority="high" loading="eager" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-fluid" />
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={showAboutModal}
                onClose={() => setShowAboutModal(false)}
                title="About Me"
                maxWidth="max-w-2xl"
            >
                <div className="p-6 sm:p-8 flex flex-col gap-8">
                    <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty text-base sm:text-lg">
                        {personal?.about_me ? (
                            personal.about_me.split('\n').map((paragraph, idx) => (
                                paragraph.trim() ? <p key={idx}>{paragraph}</p> : <div key={idx} className="h-2" />
                            ))
                        ) : (
                            <p>{bio}</p>
                        )}
                    </div>

                    {(personal?.email || personal?.phone) && (
                        <div className={`pt-6 border-t border-zinc-100 dark:border-zinc-800/60 grid grid-cols-1 ${personal?.email && personal?.phone ? 'sm:grid-cols-2' : ''} gap-4`}>
                            {personal?.email && (
                                <div className="flex items-start gap-3">
                                    <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 mt-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </span>
                                    <div className="flex flex-col min-w-0 pt-0.5">
                                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email</span>
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 break-words select-all">{personal.email}</span>
                                    </div>
                                </div>
                            )}
                            {personal?.phone && (
                                <div className="flex items-start gap-3">
                                    <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 mt-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </span>
                                    <div className="flex flex-col min-w-0 pt-0.5">
                                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Phone</span>
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 break-words select-all">{personal.phone}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Modal>

        </section>
    );
}