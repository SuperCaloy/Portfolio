import React from 'react';
import { BrandIcon, resolveProjectTechName } from '../../utils/skillIcon';

export const STATUS_STYLES = {
    'Completed': 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.2)]',
    'In Progress': 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.2)]',
    'Archived': 'bg-zinc-800/80 border-zinc-600/50 text-zinc-300 shadow-none',
};

export const STATUS_DOT_STYLES = {
    'Completed': 'bg-emerald-400 shadow-[0_0_8px_#10B981]',
    'In Progress': 'bg-amber-400 shadow-[0_0_8px_#F59E0B] animate-[live-pulse_2s_infinite]',
    'Archived': 'bg-zinc-400',
};

export function StatusBadge({ status, className = '' }) {
    if (!status) return null;
    const statusText = typeof status === 'object' && status?.value ? status.value : String(status);
    const style = STATUS_STYLES[statusText] || 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.2)]';
    const dotStyle = STATUS_DOT_STYLES[statusText] || 'bg-emerald-400 shadow-[0_0_8px_#10B981]';
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider ${style} ${className}`}>
            <span className={`w-2 h-2 rounded-full inline-block shrink-0 ${dotStyle}`} />
            <span>{statusText}</span>
        </span>
    );
}

export function TechTag({ tech, skills, size = 'w-3.5 h-3.5', className = '' }) {
    const rawName = typeof tech === 'string' ? tech : tech?.name || '';
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 hover:border-emerald-500/30 text-zinc-300 hover:text-white font-mono text-[11px] transition-colors select-none ${className}`}>
            <BrandIcon name={resolveProjectTechName(rawName, skills)} className={`${size} shrink-0 object-contain`} />
            <span>{rawName}</span>
        </span>
    );
}
