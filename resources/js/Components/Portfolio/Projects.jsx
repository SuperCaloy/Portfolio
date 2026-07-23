import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
const STATUS_STYLES = {
    'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    'Archived': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

function ProjectCard({ project }) {
    return (
        <div
            key={project.id ?? project.title}
            className="group relative p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-all space-y-3"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                        {project.title}
                    </h3>
                    {project.status && (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[project.status] || STATUS_STYLES['Archived']}`}>
                            {project.status}
                        </span>
                    )}
                </div>
            </div>

            {(project.summary || project.description) && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {project.summary || project.description}
                </p>
            )}

            {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech_stack.map((tech, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-4 pt-1">
                {project.github_url && (
                    <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Code
                    </a>
                )}

                {project.live_demo_url && (
                    <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        Live Demo
                    </a>
                )}
            </div>
        </div>
    );
}

export default function Projects({ projects = [] }) {
    const [showModal, setShowModal] = useState(false);
    const featuredProjects = projects.filter((p) => p.is_featured);
    const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects;

    useEffect(() => {
        if (!showModal) return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [showModal]);

    if (projects.length === 0) return null;

    return (
        <section id="projects" className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                    Featured Projects
                </h2>
                <span className="text-xs text-zinc-500 dark:text-zinc-600 font-mono">{displayProjects.length} project{displayProjects.length > 1 ? 's' : ''}</span>
            </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {displayProjects.map((project) => (
                    <ProjectCard key={project.id ?? project.title} project={project} />
                ))}
            </div>

            {projects.length > displayProjects.length && (
                <button
                    onClick={() => setShowModal(true)}
                    className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors underline underline-offset-4"
                >
                    View All Projects ({projects.length})
                </button>
            )}

            {showModal && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto styled-scrollbar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">All Projects</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.map((project) => (
                                <ProjectCard key={project.id ?? project.title} project={project} />
                            ))}
                        </div>
           </div>
                </div>,
                document.body
            )}
        </section>
    );
}