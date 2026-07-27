import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ViewProjectModal from '../Shared/ViewProjectModal';
import useInView from '../../hooks/useInView';
import { getProjectTechIcon, getProjectTechColor } from '../../utils/skillIcon';

const STATUS_STYLES = {
    'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    'Archived': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

function ProjectCard({ project, skills, onSelect }) {
    const [linksHovered, setLinksHovered] = useState(false);

    return (
        <button
            onClick={() => onSelect(project)}
            className="group relative h-full flex flex-col overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:shadow-md hover:-translate-y-0.5 transition-all text-left w-full"
        >
            {project.image_path && (
                <div className="w-full aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img
                        src={project.image_path}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                </div>
            )}

            <div className="space-y-3 flex-1 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                            {project.title}
                        </h3>
                        {project.status && (
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[project.status] || STATUS_STYLES['Archived']}`}>
                                {project.status}
                            </span>
                        )}
                    </div>
                </div>

                {project.subtitle || project.description ? (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {project.subtitle || project.description}
                    </p>
                ) : (
                    <p className="text-sm text-zinc-400 dark:text-zinc-600 italic leading-relaxed">
                        Details coming soon.
                    </p>
                )}

                {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tech_stack.map((tech, idx) => {
                            const Icon = getProjectTechIcon(tech, skills);
                            const color = getProjectTechColor(tech, skills);
                            return (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-xs"
                                >
                                    {Icon && <Icon className="w-3 h-3 shrink-0" style={color ? { color } : undefined} />}
                                    {tech}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex items-center flex-wrap justify-between gap-y-1 pt-3 mt-3 mx-5 sm:mx-6 mb-5 sm:mb-6 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <div
                    className="flex items-center gap-4"
                    onMouseEnter={() => setLinksHovered(true)}
                    onMouseLeave={() => setLinksHovered(false)}
                >
                    {project.github_url && (
                        <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 whitespace-nowrap"
                        >
                            View Code
                        </a>
                    )}
                    {project.demo_url && (
                        <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 whitespace-nowrap"
                        >
                            Live Preview
                        </a>
                    )}
                </div>
                <span className={`text-[11px] font-mono text-zinc-400 dark:text-zinc-600 whitespace-nowrap shrink-0 ml-3 transition-opacity ${linksHovered ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    View details →
                </span>
            </div>
        </button>
    );
}

export default function Projects({ projects = [], skills = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [sectionRef, isInView] = useInView();
    const displayProjects = projects.slice(0, 3);

    const gridColsClass = (count) => {
        if (count <= 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
        if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    };

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
        <section
            id="projects"
            ref={sectionRef}
            className={`space-y-4 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                    Projects
                </h2>
                <span className="text-sm text-zinc-500 dark:text-zinc-600 font-mono">{projects.length} project{projects.length > 1 ? 's' : ''}</span>
            </div>

            <div className={`grid ${gridColsClass(displayProjects.length)} gap-4`}>
                {displayProjects.map((project, idx) => (
                    <ProjectCard key={`${project.id ?? project.title ?? 'project'}-${idx}`} project={project} skills={skills} onSelect={setSelectedProject} />
                ))}
            </div>

            {projects.length > displayProjects.length && (
                <button
                    onClick={() => setShowModal(true)}
                    className="text-sm font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors underline underline-offset-4"
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
                        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto styled-scrollbar"
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

                        <div className={`p-6 grid ${gridColsClass(Math.min(projects.length, 2))} gap-5`}>
                            {projects.map((project, idx) => (
                                <ProjectCard key={`${project.id ?? project.title ?? 'project'}-${idx}`} project={project} skills={skills} onSelect={setSelectedProject} />
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {selectedProject && (
                <ViewProjectModal
                    project={selectedProject}
                    skills={skills}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
}