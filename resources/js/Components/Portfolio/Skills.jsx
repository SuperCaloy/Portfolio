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
        <div className={`p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-soft transition-all space-y-3 ${spanFull ? 'sm:col-span-2' : ''}`}>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {category}
            </h3>

            <div className="flex flex-wrap gap-2">
                {visibleItems.map((skill) => (
                    <SkillTag key={skill.id ?? skill.name} skill={skill} />
                ))}

                {!expanded && remaining > 0 && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800/60 border border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 active:scale-95 font-mono text-sm transition-all"
                    >
                        +{remaining} more
                    </button>
                )}
            </div>
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
                    <SkillCard
                        key={group.category}
                        category={group.category}
                        items={group.items}
                        spanFull={isOdd && idx === grouped.length - 1}
                    />
                ))}
            </div>
        </section>
    );
}