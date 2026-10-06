import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import Lightbox from '../Shared/Lightbox';
import { optimizeCloudinaryUrl } from '../../utils/image';
import { STATUS_STYLES, TechTag } from './ProjectMeta';
import { formatProjectRange as formatProjectDate } from '../../utils/date';
export default function ViewProjectModal({ project, skills = [], onClose, onEdit }) {
    const [showLightbox, setShowLightbox] = useState(false);

    return (
        <Modal
            isOpen={!!project}
            onClose={onClose}
            onEscape={() => (showLightbox ? setShowLightbox(false) : onClose())}
            maxWidth="max-w-2xl"
            ariaLabel={project?.title || 'Project details'}
            title={project?.title}
        >
            {project && (
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        {project.status && (
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[project.status] || STATUS_STYLES['Archived']}`}>
                                {project.status}
                            </span>
                        )}
                        {formatProjectDate(project) && (
                            <span className="text-sm font-mono font-medium text-zinc-500 dark:text-zinc-400">
                                {formatProjectDate(project)}
                            </span>
                        )}
                    </div>

                    {project.image_path && (
                        <img
                            src={optimizeCloudinaryUrl(project.image_path, 1200)}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full max-h-[50vh] object-contain rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-zoom-in bg-zinc-50 dark:bg-zinc-900"
                            onClick={() => setShowLightbox(true)}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    )}

                    {project.subtitle && (
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap [text-wrap:pretty]">
                            {project.subtitle}
                        </p>
                    )}

                    {project.description && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap [text-wrap:pretty]">
                            {project.description}
                        </p>
                    )}

                    {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {project.tech_stack.map((tech, idx) => (
                                <TechTag key={idx} tech={tech} skills={skills} />
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Code
                            </a>
                        )}

                        {project.demo_url && (
                            <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                Live Preview
                            </a>
                        )}
                    </div>

                    {onEdit && (
                        <div className="flex justify-end pt-2 border-t border-zinc-200 dark:border-zinc-800">
                            <button
                                onClick={() => onEdit(project)}
                                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-medium"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            )}

            {project && (
                <Lightbox
                    isOpen={showLightbox}
                    onClose={() => setShowLightbox(false)}
                    src={optimizeCloudinaryUrl(project.image_path, 1920)}
                    alt={project.title}
                />
            )}
        </Modal>
    );
}