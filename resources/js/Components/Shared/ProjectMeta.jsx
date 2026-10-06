import React from 'react';
import { BrandIcon, resolveProjectTechName } from '../../utils/skillIcon';

export const STATUS_STYLES = {
    'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    'Archived': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

export function StatusBadge({ status }) {
    if (!status) return null;
    const style = STATUS_STYLES[status] || STATUS_STYLES['Archived'];
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-medium ${style}`}>
            {status}
        </span>
    );
}

export function TechTag({ tech, skills, size = 'w-3 h-3' }) {
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs">
            <BrandIcon name={resolveProjectTechName(tech, skills)} className={`${size} shrink-0`} />
            {tech}
        </span>
    );
}
