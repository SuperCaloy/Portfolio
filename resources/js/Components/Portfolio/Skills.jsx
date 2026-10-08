import React, { useState, useMemo } from 'react';
import { BrandIcon } from '../../utils/skillIcon';
import { SKILL_CATEGORIES } from '../../constants/admin';

const MAX_VISIBLE = 12;

function getCategoryTheme(catKey) {
    if (catKey.includes('back')) {
        return {
            shellBorder: 'border-emerald-500/20',
            hoverGlow: 'hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]',
            dotColor: 'bg-emerald-400',
            badgeBg: 'bg-emerald-500/10',
            badgeText: 'text-emerald-400',
            badgeBorder: 'border-emerald-500/25',
        };
    }
    if (catKey.includes('front')) {
        return {
            shellBorder: 'border-cyan-500/20',
            hoverGlow: 'hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]',
            dotColor: 'bg-cyan-400',
            badgeBg: 'bg-cyan-500/10',
            badgeText: 'text-cyan-400',
            badgeBorder: 'border-cyan-500/25',
        };
    }
    if (catKey.includes('data')) {
        return {
            shellBorder: 'border-amber-500/20',
            hoverGlow: 'hover:border-amber-500/50 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]',
            dotColor: 'bg-amber-400',
            badgeBg: 'bg-amber-500/10',
            badgeText: 'text-amber-400',
            badgeBorder: 'border-amber-500/25',
        };
    }
    if (catKey.includes('dev') || catKey.includes('ops')) {
        return {
            shellBorder: 'border-blue-500/20',
            hoverGlow: 'hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]',
            dotColor: 'bg-blue-400',
            badgeBg: 'bg-blue-500/10',
            badgeText: 'text-blue-400',
            badgeBorder: 'border-blue-500/25',
        };
    }
    if (catKey.includes('tool')) {
        return {
            shellBorder: 'border-purple-500/20',
            hoverGlow: 'hover:border-purple-500/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]',
            dotColor: 'bg-purple-400',
            badgeBg: 'bg-purple-500/10',
            badgeText: 'text-purple-400',
            badgeBorder: 'border-purple-500/25',
        };
    }
    return {
        shellBorder: 'border-emerald-500/20',
        hoverGlow: 'hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]',
        dotColor: 'bg-emerald-400',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400',
        badgeBorder: 'border-emerald-500/25',
    };
}

function SkillChip({ skill }) {
    const [iconStatus, setIconStatus] = useState('loading');

    return (
        <span
            className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:py-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/[0.08] border border-white/10 hover:border-emerald-500/40 text-zinc-200 hover:text-white transition-all duration-200 select-none cursor-default shadow-sm hover:shadow-[0_0_16px_rgba(16,185,129,0.15)] active:scale-[0.98]"
        >
            <span className="w-5 h-5 rounded-md bg-white/[0.06] border border-white/10 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/20 flex items-center justify-center shrink-0 overflow-hidden transition-colors">
                <BrandIcon
                    name={skill.icon_name || skill.name}
                    className="w-3.5 h-3.5 object-contain"
                    onStatusChange={setIconStatus}
                />
                {iconStatus === 'none' && (
                    <span className="font-mono text-[10px] text-zinc-400 font-bold leading-none">
                        {skill.name.charAt(0).toUpperCase()}
                    </span>
                )}
            </span>
            <span className="font-mono text-xs font-medium tracking-tight whitespace-nowrap">
                {skill.name}
            </span>
        </span>
    );
}

export default function Skills({ skills = [] }) {
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [expandedCards, setExpandedCards] = useState({});

    // Group skills by category dynamically from database
    const grouped = useMemo(() => {
        const baseCategories = SKILL_CATEGORIES.length > 0 ? SKILL_CATEGORIES : ['Backend', 'Frontend', 'Database', 'DevOps', 'Tools'];
        const dbCategories = Array.from(new Set(skills.map((s) => s.category).filter(Boolean)));
        const allCategoriesList = [...new Set([...baseCategories, ...dbCategories])];
        return allCategoriesList
            .map((category) => ({
                category,
                items: skills.filter((skill) => skill.category === category),
            }))
            .filter((group) => group.items.length > 0);
    }, [skills]);

    const allCategories = useMemo(() => {
        return ['ALL', ...grouped.map((g) => g.category)];
    }, [grouped]);

    const displayedGroups = useMemo(() => {
        if (selectedCategory === 'ALL') return grouped;
        return grouped.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());
    }, [grouped, selectedCategory]);

    const toggleExpand = (category) => {
        setExpandedCards((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    // Calculate responsive column spans to guarantee perfect geometric balance
    const getCardColSpan = (idx, total) => {
        if (total === 1) {
            return 'md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4';
        }
        if (total === 2) {
            return 'md:col-span-6 lg:col-span-6';
        }
        if (total === 3) {
            return 'md:col-span-4 lg:col-span-4';
        }
        if (total === 4) {
            return 'md:col-span-6 lg:col-span-6';
        }
        if (total === 5) {
            // Row 1: Two prominent pillars (Backend & Frontend) take 50% each
            if (idx < 2) {
                return 'md:col-span-6 lg:col-span-6';
            }
            // Row 2: Three ecosystem foundations (Database, DevOps, Tools) take 33.3% each
            return 'md:col-span-4 lg:col-span-4';
        }
        // General fallback for larger sets
        return 'md:col-span-6 lg:col-span-4';
    };

    if (skills.length === 0) return null;

    return (
        <section
            id="tech"
            className="tech-sec relative z-10 py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto w-full"
            aria-label="Technologies & Architecture"
        >
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
                <h2
                    className="font-black uppercase text-3xl sm:text-5xl md:text-6xl text-white hero-heading tracking-tight"
                    style={{ fontFamily: "'Kanit', sans-serif" }}
                >
                    Tech Stack & Ecosystem
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
                    Core technologies, frameworks, and architecture tools utilized across production systems.
                </p>
            </div>

            {/* Category Filter Pills */}
            <div className="tech-filter flex justify-center flex-wrap gap-2 sm:gap-2.5 mb-10 sm:mb-12">
                {allCategories.map((cat) => {
                    const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                    const count = cat === 'ALL'
                        ? skills.length
                        : (grouped.find((g) => g.category.toLowerCase() === cat.toLowerCase())?.items.length || 0);

                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`filter-pill inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                isActive
                                    ? 'active bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] border-emerald-400'
                                    : 'bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                            }`}
                        >
                            <span>{cat}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                isActive ? 'bg-black/20 text-black font-black' : 'bg-white/10 text-zinc-400'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Balanced Bento Grid */}
            <div className="tech-bento grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
                {displayedGroups.map((group, idx) => {
                    const total = displayedGroups.length;
                    const colSpanClass = getCardColSpan(idx, total);
                    const isExpanded = selectedCategory !== 'ALL' || !!expandedCards[group.category];
                    const visibleItems = isExpanded ? group.items : group.items.slice(0, MAX_VISIBLE);
                    const remaining = group.items.length - MAX_VISIBLE;

                    const catKey = (group.category || '').toLowerCase();
                    const theme = getCategoryTheme(catKey);

                    return (
                        <div
                            key={group.category}
                            className={`tech-card tech-shell p-1.5 rounded-[22px] bg-white/[0.03] border ${theme.shellBorder} transition-all duration-300 hover:-translate-y-0.5 ${theme.hoverGlow} ${colSpanClass}`}
                        >
                            <div className="tech-core rounded-[18px] p-5 sm:p-6 bg-[#111115] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] h-full flex flex-col justify-between">
                                <div>
                                    <div className="tech-head flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                                        <div className="flex items-center gap-2.5">
                                            <span className={`w-2 h-2 rounded-full ${theme.dotColor}`} />
                                            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                                {group.category}
                                            </h3>
                                        </div>
                                        <span className={`tech-count font-mono text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
                                            {group.items.length} {group.items.length === 1 ? 'TECH' : 'TECHS'}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                        {visibleItems.map((skill) => (
                                            <SkillChip key={skill.id ?? skill.name} skill={skill} />
                                        ))}

                                        {!isExpanded && remaining > 0 && (
                                            <button
                                                onClick={() => toggleExpand(group.category)}
                                                className="inline-flex items-center px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-mono text-xs cursor-pointer transition-all"
                                            >
                                                +{remaining} more
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}