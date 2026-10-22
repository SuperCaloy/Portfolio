import React, { useState, useMemo } from 'react';
import Modal from '../Shared/Modal';
import { StatusBadge } from '../Shared/ProjectMeta';

export default function ViewAllProjectsModal({ isOpen, projects = [], onClose, onSelectProject }) {
    const [filter, setFilter] = useState('ALL');

    // Compute dynamic filter options with counts
    const filterOptions = useMemo(() => {
        const counts = { ALL: projects.length };
        projects.forEach((p) => {
            const rawStatus = typeof p.status === 'object' && p.status?.value ? p.status.value : p.status;
            const statusKey = String(rawStatus || '').trim();
            if (statusKey) {
                counts[statusKey] = (counts[statusKey] || 0) + 1;
            }
        });

        const statusKeys = Object.keys(counts).filter((k) => k !== 'ALL');
        return [
            { key: 'ALL', label: 'ALL', count: counts.ALL },
            ...statusKeys.map((key) => ({
                key,
                label: key.toUpperCase(),
                count: counts[key],
            })),
        ];
    }, [projects]);

    const filtered = useMemo(() => {
        if (filter === 'ALL') return projects;
        return projects.filter((p) => {
            const val = typeof p.status === 'object' && p.status?.value ? p.status.value : p.status;
            return String(val || '').toLowerCase() === filter.toLowerCase();
        });
    }, [projects, filter]);

    return (
        <Modal
            id="allWorksModal"
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-4xl"
            title={`Complete Project Catalog (${projects.length})`}
            ariaLabel="All Projects Archive"
            bodyClassName="flex-1 min-h-0 flex flex-col overflow-hidden p-0"
        >
            {/* Pinned Filter Bar */}
            {filterOptions.length > 1 && (
                <div className="catalog-filter-bar status-filter-bar shrink-0 px-5 sm:px-6 py-3.5 bg-[#121216] border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex flex-wrap items-center gap-2">
                        {filterOptions.map((opt) => {
                            const isSelected = filter.toLowerCase() === opt.key.toLowerCase();
                            return (
                                <button
                                    key={opt.key}
                                    onClick={() => setFilter(opt.key)}
                                    aria-pressed={isSelected}
                                    className={`filter-pill status-filter-btn inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 min-h-[36px] rounded-full text-xs font-mono font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? 'active bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                                            : 'bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:border-emerald-500/30 hover:bg-white/[0.08]'
                                    }`}
                                >
                                <span>{opt.label}</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        filter.toLowerCase() === opt.key.toLowerCase()
                                            ? 'bg-black/20 text-black font-bold'
                                            : 'bg-white/10 text-zinc-400'
                                    }`}
                                >
                                    {opt.count}
                                </span>
                            </button>
                        );
                    })}
                    </div>
                    <span className="font-mono text-xs text-zinc-500 hidden sm:inline">
                        Showing {filtered.length} of {projects.length}
                    </span>
                </div>
            )}

            {/* Single Scrollable Project Cards Grid */}
            <div
                className="catalog-scroll-area catalog-grid-scroll flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-5 styled-scrollbar"
                data-lenis-prevent
            >
                {filtered.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-zinc-300 font-medium text-sm">
                            No projects match the selected filter.
                        </p>
                        <button
                            onClick={() => setFilter('ALL')}
                            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
                        >
                            Reset filter to show all ({projects.length})
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8 auto-rows-fr">
                        {filtered.map((proj, idx) => (
                            <div
                                key={proj.id || idx}
                                onClick={() => onSelectProject(proj)}
                                className="catalog-item p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)] cursor-pointer group transition-all duration-300 hover:-translate-y-1 flex flex-col"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onSelectProject(proj);
                                    }
                                }}
                            >
                                <div className="rounded-xl p-4 sm:p-5 bg-[#121216] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] flex-1 flex flex-col justify-between gap-4">
                                    <div className="space-y-2.5">
                                        {/* Top Meta Row */}
                                        <div className="flex justify-between items-start gap-2.5 text-xs font-mono">
                                            <span
                                                className="catalog-category card-category text-emerald-400 font-semibold text-[11px] tracking-wider uppercase leading-snug break-words flex-1 pr-1 line-clamp-2"
                                                title={proj.subtitle || 'Engineering Architecture'}
                                            >
                                                {proj.subtitle || 'Engineering Architecture'}
                                            </span>
                                            {proj.status && (
                                                <div className="shrink-0">
                                                    <StatusBadge status={proj.status} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                                            {proj.title}
                                        </h4>

                                        {/* Description */}
                                        {proj.description && (
                                            <p className="catalog-desc card-desc text-xs text-zinc-300 font-normal leading-relaxed line-clamp-3">
                                                {proj.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Bottom Action Row */}
                                    <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs font-mono text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors">
                                        <span>View specifications</span>
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
}
