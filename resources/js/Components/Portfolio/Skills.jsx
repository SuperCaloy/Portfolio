import React from 'react';
import useInView from '../../hooks/useInView';
import { getSkillIcon, getSkillColor } from '../../utils/skillIcon';

export default function Skills({ skills = [] }) {
    const [sectionRef, isInView] = useInView();

    if (skills.length === 0) return null;

    return (
        <section
            id="tech"
            ref={sectionRef}
            className={`space-y-4 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                Tech Stack & Tools
            </h2>

            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => {
                    const Icon = getSkillIcon(skill);
                    const color = getSkillColor(skill);
                    return (
                        <span
                            key={skill.id ?? skill.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-sm hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all"
                        >
                            {Icon && <Icon className="w-4 h-4 shrink-0" style={color ? { color } : undefined} />}
                            {skill.name}
                        </span>
                    );
                })}
            </div>
        </section>
    );
}