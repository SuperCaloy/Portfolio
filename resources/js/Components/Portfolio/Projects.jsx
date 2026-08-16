import React, { useState, useMemo, useEffect, useRef } from 'react';
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

function ProjectListItem({ project, skills, onSelect }) {
    const [imageError, setImageError] = useState(false);

    return (
        <button
            onClick={() => onSelect(project)}
            className="group w-full flex items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-zinc-200/50 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-all duration-700 ease-fluid text-left hover:-translate-y-1 shadow-sm hover:shadow-soft active:scale-[0.98]"
        >
            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden ring-1 ring-zinc-200/50 dark:ring-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                {project.image_path && !imageError ? (
                    <img
                        src={project.image_path}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-fluid group-hover:scale-105"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                        <svg className="w-6 h-6 text-zinc-300 dark:text-zinc-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center gap-2 sm:gap-3">
                <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 [text-wrap:pretty]">
                        {project.title}
                    </h3>
                    {project.subtitle && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                            {project.subtitle}
                        </p>
                    )}
                </div>
                {project.status && (
                    <span className={`self-start inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[project.status] || STATUS_STYLES['Archived']}`}>
                        {project.status}
                    </span>
                )}
            </div>

            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-700 ease-fluid">
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </div>
        </button>
    );
}

function ProjectCard({ project, skills, onSelect, index = 0 }) {
    const [imageError, setImageError] = useState(false);

    const mappedSkills = useMemo(() => {
        if (!project.skills || !skills) return [];
        return project.skills.map(ps => {
            if (typeof ps === 'object' && ps.name) return ps;
            return skills.find(s => s.id === ps || s.name === ps) || { name: ps };
        }).filter(Boolean);
    }, [project.skills, skills]);

    // Determine layout direction for the Zig-Zag effect
    const isReversed = index % 2 !== 0;

    return (
        <button
            onClick={() => onSelect(project)}
            className={`group relative w-full text-left p-1.5 md:p-2 rounded-[2rem] bg-zinc-100/50 dark:bg-white/5 ring-1 ring-zinc-200/50 dark:ring-white/10 hover:ring-zinc-300 dark:hover:ring-zinc-700 hover:shadow-ambient hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-700 ease-fluid`}
        >
            <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} overflow-hidden rounded-[1.625rem] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]`}>
                
                {/* Image Section */}
                <div className={`w-full md:w-1/2 aspect-video md:aspect-auto md:min-h-[340px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 relative`}>
                    {project.image_path && !imageError ? (
                        <img
                            src={project.image_path}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-fluid group-hover:scale-105"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                            <span className="text-zinc-400 font-mono text-sm">No Preview</span>
                        </div>
                    )}
                    {/* Inner subtle shadow for depth */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-none" />
                </div>
                
                {/* Content Section */}
                <div className={`w-full md:w-1/2 flex flex-col bg-white dark:bg-[#0a0a0a]`}>
                    <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                {project.title}
                            </h3>
                            {project.subtitle && (
                                <p className="text-base text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                    {project.subtitle}
                                </p>
                            )}
                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                {project.status && (
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${STATUS_STYLES[project.status] || STATUS_STYLES['Archived']}`}>
                                        {project.status}
                                    </span>
                                )}
                                {formatProjectDate(project) && (
                                    <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                        {formatProjectDate(project)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {project.tech_stack.slice(0, 4).map((tech, idx) => (
                                    <TechTag key={idx} tech={tech} skills={skills} />
                                ))}
                                {project.tech_stack.length > 4 && (
                                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 font-mono text-xs">
                                        +{project.tech_stack.length - 4}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-4 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-[#050505]/50 mt-auto">
                        <div className="flex items-center gap-6">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-sm font-semibold tracking-wide text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 no-underline whitespace-nowrap transition-colors flex items-center gap-2"
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
                                    className="text-sm font-semibold tracking-wide text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 no-underline whitespace-nowrap transition-colors flex items-center gap-2"
                                >
                                    Preview
                                </a>
                            )}
                        </div>
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
}

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

export default function Projects({ projects = [], skills = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [visibleModalCount, setVisibleModalCount] = useState(5);
    const [sectionRef, isInView] = useInView();

    // Latest first, start_date preferred, falls back to created_at.
    const getProjectDate = (project) => {
        const value = project.start_date || project.created_at;
        const time = value ? new Date(value).getTime() : 0;
        return isNaN(time) ? 0 : time;
    };

    // Featured projects first, latest non-featured fills remaining slots
    const featuredProjects = [...projects]
        .filter((project) => project.is_featured)
        .sort((a, b) => getProjectDate(b) - getProjectDate(a));

    const nonFeaturedProjects = [...projects]
        .filter((project) => !project.is_featured)
        .sort((a, b) => getProjectDate(b) - getProjectDate(a));

    const allSortedProjects = [...featuredProjects, ...nonFeaturedProjects];
    const displayProjects = allSortedProjects.slice(0, 4);

    const observerTarget = useRef(null);

    useEffect(() => {
        if (!showModal) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleModalCount((prev) => prev + 5);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) observer.observe(currentTarget);

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, [showModal, visibleModalCount]);

    if (projects.length === 0) return null;

    const handleCloseModal = () => {
        setShowModal(false);
        // Reset count after modal exit animation finishes
        setTimeout(() => setVisibleModalCount(5), 300);
    };

    return (
        <section
            id="projects"
            ref={sectionRef}
            className={`space-y-4 transition-all duration-700 ease-fluid ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            <div className="flex items-center justify-between mb-8 sm:mb-12">
                <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                    Projects
                </h2>
                <span className="text-sm text-zinc-500 dark:text-zinc-600 font-mono">{projects.length} project{projects.length > 1 ? 's' : ''}</span>
            </div>

            {/* Editorial Zig-Zag Layout: Replaces the Grid with a vertical stack of full-width case studies */}
            <div className="flex flex-col space-y-12 sm:space-y-16 lg:space-y-24">
                {displayProjects.map((project, idx) => (
                    <AnimatedItem key={`${project.id ?? project.title ?? 'project'}-${idx}`} index={idx}>
                        <div className="w-full">
                            <ProjectCard
                                project={project}
                                skills={skills}
                                onSelect={setSelectedProject}
                                index={idx}
                            />
                        </div>
                    </AnimatedItem>
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

            <Modal isOpen={showModal} onClose={handleCloseModal} maxWidth="max-w-4xl" ariaLabel="All Projects" title="All Projects">
                <div className="p-4 sm:p-6 flex flex-col gap-3 bg-zinc-50 dark:bg-transparent">
                    {allSortedProjects.slice(0, visibleModalCount).map((project, idx) => (
                        <ProjectListItem key={`${project.id ?? project.title ?? 'project'}-${idx}`} project={project} skills={skills} onSelect={setSelectedProject} />
                    ))}
                    
                    {/* Infinite Scroll Sentinel */}
                    {visibleModalCount < allSortedProjects.length && (
                        <div ref={observerTarget} className="h-4 w-full" />
                    )}
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