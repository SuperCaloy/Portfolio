import React, { useState } from 'react';
import { optimizeCloudinaryUrl } from '../../utils/image';
import { formatProjectRange } from '../../utils/date';
import { GithubIcon } from '../Shared/SocialIcons';
import { StatusBadge, TechTag } from '../Shared/ProjectMeta';
import ViewProjectModal from '../Shared/ViewProjectModal';
import ViewAllProjectsModal from './ViewAllProjectsModal';

export default function Projects({
    projects = [],
    skills = [],
    selectedProject: controlledSelectedProject,
    setSelectedProject: controlledSetSelectedProject,
}) {
    const [internalSelectedProject, setInternalSelectedProject] = useState(null);
    const selectedProject = controlledSelectedProject !== undefined ? controlledSelectedProject : internalSelectedProject;
    const setSelectedProject = controlledSetSelectedProject || setInternalSelectedProject;
    const [showAllWorks, setShowAllWorks] = useState(false);

    const featuredProjects = projects.slice(0, 5);

    return (
        <section
            id="featured-works"
            className="projects-sec bg-[#0C0C0C] rounded-t-[36px] sm:rounded-t-[44px] -mt-9 relative z-10 py-16 sm:py-24 px-4 sm:px-6 shadow-[0_-25px_50px_rgba(0,0,0,0.7)]"
            aria-label="Projects"
        >
            <div id="projects" className="absolute -top-12 pointer-events-none" />
            <div className="max-w-5xl mx-auto">
                {/* Header with Title and View All Trigger */}
                <div className="sec-top-flex flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 sm:mb-14">
                    <div>
                        <h2
                            className="section-title font-black uppercase text-3xl sm:text-5xl md:text-6xl text-white hero-heading"
                            style={{ fontFamily: "'Kanit', sans-serif" }}
                        >
                            Featured Works
                        </h2>
                    </div>

                    <button
                        onClick={() => setShowAllWorks(true)}
                        className="view-all-btn inline-flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full hover:bg-emerald-500 hover:text-black transition-all cursor-pointer select-none"
                    >
                        <span>View All Works ({projects.length})</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>

                {/* Notebook Stack Container: Cards Stick and Pin with Safe Header Clearance */}
                <div className="notebook-deck relative pb-10">
                    {featuredProjects.map((project, idx) => (
                        <div
                            key={project.id || idx}
                            onClick={() => setSelectedProject(project)}
                            className="notebook-card project-shell sticky bg-[#121216] border border-white/10 rounded-[22px] sm:rounded-[36px] p-1.5 sm:p-2 mb-8 sm:mb-24 shadow-[0_-16px_36px_rgba(0,0,0,0.95),0_25px_60px_rgba(0,0,0,0.9)] cursor-pointer hover:border-emerald-500/50 transition-all duration-300 group touch-manipulation min-h-[810px] sm:min-h-[600px] md:min-h-[580px] flex flex-col"
                            style={{
                                top: `calc(clamp(78px, 10vh, 98px) + ${idx} * clamp(8px, 1.2vh, 16px))`,
                                zIndex: idx + 1,
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSelectedProject(project);
                                }
                            }}
                        >
                            <div className="notebook-core project-core bg-[#121216] rounded-[18px] sm:rounded-[30px] p-4 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex-1 flex flex-col justify-between w-full">
                                {/* Card Top Info: Locked Top-Right Action with Flexible Wrapping Title */}
                                <div className="card-top-info flex items-start justify-between gap-4 mb-5">
                                    <div className="card-num-title flex items-baseline gap-3 sm:gap-3.5 flex-1 min-w-0">
                                        <span className="card-num font-black text-3xl sm:text-4xl text-zinc-400 font-mono shrink-0">
                                            0{idx + 1}
                                        </span>
                                        <h3 className="card-name text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors break-words flex-1 min-w-0 leading-snug">
                                            {project.title}
                                        </h3>
                                    </div>

                                    {project.github_url && (
                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400/50 text-xs text-zinc-300 hover:text-white transition-all font-mono group/gh shrink-0 self-start mt-0.5 sm:mt-1"
                                            aria-label={`GitHub repository for ${project.title}`}
                                        >
                                            <GithubIcon className="w-3.5 h-3.5 text-zinc-300 group-hover/gh:text-white transition-colors" />
                                            <svg className="w-3 h-3 text-emerald-400 group-hover/gh:translate-x-0.5 group-hover/gh:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                                            </svg>
                                        </a>
                                    )}
                                </div>

                                {/* Card Media & Details Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-5 flex-1">
                                    <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                                        <div className="space-y-3">
                                            {/* Subtitle Architecture Pill */}
                                            {project.subtitle && (
                                                <div className="inline-block">
                                                    <span className="font-mono text-[11px] sm:text-xs text-emerald-400 font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25">
                                                        {project.subtitle}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Rich Description */}
                                            <p className="text-sm text-zinc-300 font-normal leading-relaxed line-clamp-3 sm:line-clamp-4 text-pretty">
                                                {project.description || project.subtitle || 'Full stack production application architecture with high-performance database layer.'}
                                            </p>

                                            {/* Timeline Dates & Live Demo Link */}
                                            <div className="flex items-center flex-wrap gap-3 pt-1 text-xs font-mono text-zinc-400">
                                                {(project.start_date || project.end_date) && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                        <span>{formatProjectRange(project)}</span>
                                                    </span>
                                                )}

                                                {project.demo_url && (
                                                    <a
                                                        href={project.demo_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors group/demo"
                                                    >
                                                        <span>Live Demo</span>
                                                        <svg className="w-3 h-3 group-hover/demo:translate-x-0.5 group-hover/demo:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Full Core Architecture Tech Stack */}
                                        {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-white/5">
                                                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                                                    Core Architecture Stack
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.tech_stack.map((tech, tIdx) => (
                                                        <TechTag
                                                            key={tIdx}
                                                            tech={tech}
                                                            skills={skills}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Preview Snapshot Container */}
                                    <div className="md:col-span-7 rounded-2xl overflow-hidden bg-black/60 border border-white/10 aspect-video max-h-[190px] sm:max-h-[260px] md:max-h-[300px] flex flex-col">
                                        {/* Clean Architecture Preview Bar */}
                                        <div className="project-window-bar px-3.5 py-2 bg-zinc-950/90 border-b border-white/10 flex items-center justify-between shrink-0">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                                                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                                                    SYSTEM PREVIEW
                                                </span>
                                            </div>
                                            <span className="font-mono text-[10px] text-zinc-500 truncate max-w-[160px]">
                                                {project.status || 'Active'}
                                            </span>
                                        </div>

                                        <div className="flex-1 w-full overflow-hidden relative flex items-center justify-center bg-black/40">
                                            {project.image_path ? (
                                                <img
                                                    src={optimizeCloudinaryUrl(project.image_path, 800)}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-[#121216] flex items-center justify-center p-6 text-center">
                                                    <span className="text-sm font-mono text-zinc-400">
                                                        System Architecture Snapshot
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Bottom Info */}
                                <div className="card-bottom-info flex justify-between items-center flex-wrap gap-3 pt-4 border-t border-white/10 text-xs font-mono">
                                    <StatusBadge status={project.status || 'Completed'} />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProject(project);
                                        }}
                                        className="project-spec-btn text-emerald-400 font-semibold flex items-center gap-1.5 hover:text-emerald-300 transition-colors cursor-pointer group/spec"
                                    >
                                        <span>Explore project specifications</span>
                                        <svg className="w-3.5 h-3.5 group-hover/spec:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            <ViewProjectModal
                project={selectedProject}
                skills={skills}
                onClose={() => setSelectedProject(null)}
            />

            <ViewAllProjectsModal
                isOpen={showAllWorks}
                projects={projects}
                onClose={() => setShowAllWorks(false)}
                onSelectProject={(p) => {
                    setShowAllWorks(false);
                    setSelectedProject(p);
                }}
            />
        </section>
    );
}