import React from 'react';

export default function Skills({ skills = [] }) {
    if (skills.length === 0) return null;

    return (
        <section id="skills" className="space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                Tech Stack & Tools
            </h2>

            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <span
                        key={skill.id ?? skill.name}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all"
                    >
                        {skill.name}
                    </span>
                ))}
            </div>
        </section>
    );
}