import React, { useState } from 'react';
import useInView from '../../hooks/useInView';
import { BrandIcon, resolveProjectTechName } from '../../utils/skillIcon';
// Fixed display order, matches the category enum in the database.
const CATEGORY_ORDER = ['Backend', 'Frontend', 'Database', 'DevOps', 'Tools'];
const MAX_VISIBLE = 6;

function SkillTag({ skill }) {
    return (
        <span className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-sm hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-all">
            <BrandIcon
                name={skill.icon_name || skill.name}
                className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform"
            />
            {skill.name}
        </span>
    );
}

function SkillCard({ category, items, spanFull }) {
    const [expanded, setExpanded] = useState(false);
    const visibleItems = expanded ? items : items.slice(0, MAX_VISIBLE);
    const remaining = items.length - MAX_VISIBLE;

    return (
        <div className={`p-1.5 rounded-[1.75rem] bg-white/60 dark:bg-zinc-900/40 ring-1 ring-zinc-200/70 dark:ring-zinc-800/70 hover:ring-zinc-300 dark:hover:ring-zinc-700 hover:shadow-ambient transition-all duration-500 ease-fluid ${spanFull ? 'sm:col-span-2' : ''}`}>
            <div className="h-full p-4 sm:p-5 rounded-[1.375rem] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {category}
                </h3>

                <div className="flex flex-wrap gap-2">
                    {visibleItems.map((skill) => (
                        <SkillTag key={skill.id ?? skill.name} skill={skill} />
                    ))}

                    {!expanded && remaining > 0 && (
                        <button
                            onClick={() => setExpanded(true)}
                            className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800/60 border border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 active:scale-95 font-mono text-sm transition-all duration-300 ease-fluid"
                        >
                            +{remaining} more
                        </button>
                    )}
                </div>
            </div>
        </div>
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

export default function Skills({ skills = [] }) {
    const [sectionRef, isInView] = useInView();

    if (skills.length === 0) return null;

    const grouped = CATEGORY_ORDER.map((category) => ({
        category,
        items: skills.filter((skill) => skill.category === category),
    })).filter((group) => group.items.length > 0);

    // If there's an odd number of category cards, the last one spans
    // the full row instead of leaving an empty gap beside it.
    const isOdd = grouped.length % 2 !== 0;

    return (
        <section
            id="tech"
            ref={sectionRef}
            className={`space-y-4 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                Tech Stack & Tools
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {grouped.map((group, idx) => (
                    <AnimatedItem key={group.category} index={idx}>
                        <SkillCard
                            category={group.category}
                            items={group.items}
                            spanFull={isOdd && idx === grouped.length - 1}
                        />
                    </AnimatedItem>
                ))}
            </div>
        </section>
    );
}