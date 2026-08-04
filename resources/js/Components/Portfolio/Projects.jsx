import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import ViewProjectModal from '../Shared/ViewProjectModal';
import useInView from '../../hooks/useInView';
import { BrandIcon, resolveProjectTechName } from '../../utils/skillIcon';
const STATUS_STYLES = {
    'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    'Archived': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

// Formats project dates for public display, month and year only, no day.
// Shows a range when both dates exist, "Present" when still ongoing.
function formatProjectDate(project) {
    const monthYear = (value) => {
        const date = new Date(value);
        if (isNaN(date)) return null;
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const start = project.start_date ? monthYear(project.start_date) : null;
    const end = project.end_date ? monthYear(project.end_date) : null;

    if (!start) return null;
    if (!end) return `${start} – Present`;
    if (start === end) return start;
    return `${start} – ${end}`;
}

function TechTag({ tech, skills }) {
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs">
            <BrandIcon name={resolveProjectTechName(tech, skills)} className="w-3 h-3 shrink-0" />
            {tech}
        </span>
    );
}

function ProjectCard({ project, skills, onSelect }) {
    const [imageError, setImageError] = useState(false);

    return (
        <button
            onClick={() => onSelect(project)}
            className="group relative h-full w-full text-left p-1.5 rounded-[1.75rem] bg-zinc-100/80 dark:bg-zinc-900/40 ring-1 ring-zinc-200/70 dark:ring-zinc-800/70 hover:ring-zinc-300 dark:hover:ring-zinc-700 hover:shadow-soft-lg hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-500 ease-fluid"
        >
            <div className="h-full flex flex-col overflow-hidden rounded-[1.375rem] bg-white dark:bg-zinc-950/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="w-full aspect-video overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center">
                    {project.image_path && !imageError ? (
                        <img
                            src={project.image_path}
                            alt={`Screenshot of the ${project.title} project`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-fluid"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-400 dark:group-hover:text-zinc-600 transition-colors">
                            <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 8l-4 4 4 4" />
                            </svg>
                            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-600">No preview yet</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-5 sm:p-6 space-y-3">
                    <div className="space-y-1.5">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors line-clamp-1">
                            {project.title}
                        </h3>
                        {project.subtitle && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                {project.subtitle}
                            </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                            {project.status && (
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[project.status] || STATUS_STYLES['Archived']}`}>
                                    {project.status}
                                </span>
                            )}
                            {formatProjectDate(project) && (
                                <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
                                    {formatProjectDate(project)}
                                </span>
                            )}
                        </div>
                    </div>

                    {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {project.tech_stack.slice(0, 3).map((tech, idx) => (
                                <TechTag key={idx} tech={tech} skills={skills} />
                            ))}
                            {project.tech_stack.length > 3 && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 font-mono text-xs">
                                    +{project.tech_stack.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <div className="flex items-center gap-4">
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 no-underline whitespace-nowrap"
                            >
                                Code
                            </a>
                        )}
                        {project.demo_url && (
                            <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 no-underline whitespace-nowrap"
                            >
                                Preview
                            </a>
                        )}
                    </div>
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </button>
    );
}

export default function Projects({ projects = [], skills = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [sectionRef, isInView] = useInView();

    // Latest first, start_date preferred, falls back to created_at.
    const getProjectDate = (project) => {
        const value = project.start_date || project.created_at;
        const time = value ? new Date(value).getTime() : 0;
        return isNaN(time) ? 0 : time;
    };

    // Featured projects first, latest non-featured fills remaining slots
    // up to exactly 4, no bento, uniform grid regardless of composition.
    const featuredProjects = [...projects]
        .filter((project) => project.is_featured)
        .sort((a, b) => getProjectDate(b) - getProjectDate(a));

    const nonFeaturedProjects = [...projects]
        .filter((project) => !project.is_featured)
        .sort((a, b) => getProjectDate(b) - getProjectDate(a));

    const displayProjects = [...featuredProjects, ...nonFeaturedProjects].slice(0, 4);

    const gridColsClass = 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4';
    const modalGridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    if (projects.length === 0) return null;

    return (
        <section
            id="projects"
            ref={sectionRef}
            className={`space-y-4 transition-all duration-700 ease-fluid ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                    Projects
                </h2>
                <span className="text-sm text-zinc-500 dark:text-zinc-600 font-mono">{projects.length} project{projects.length > 1 ? 's' : ''}</span>
            </div>

            <div className={`grid ${gridColsClass} gap-5`}>
                {displayProjects.map((project, idx) => (
                    <ProjectCard
                        key={`${project.id ?? project.title ?? 'project'}-${idx}`}
                        project={project}
                        skills={skills}
                        onSelect={setSelectedProject}
                    />
                ))}
            </div>

            {projects.length > displayProjects.length && (
                <button
                    onClick={() => setShowModal(true)}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white text-sm font-medium active:scale-95 transition-all"
                >
                    <span>View All Projects</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} maxWidth="max-w-5xl" ariaLabel="All Projects">
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">All Projects</h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 active:scale-90 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={`p-6 grid ${modalGridClass} gap-5`}>
                    {projects.map((project, idx) => (
                        <ProjectCard key={`${project.id ?? project.title ?? 'project'}-${idx}`} project={project} skills={skills} onSelect={setSelectedProject} />
                    ))}
                </div>
            </Modal>

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