import React from 'react';
import { MESSAGE_MAX_LENGTH } from '../../hooks/useContactForm';

export default function ContactFields({ formData, handleChange, status, compact = false }) {
    const inputClass = compact
        ? 'w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all'
        : 'w-full px-4 py-3 rounded-xl text-base bg-zinc-50/50 dark:bg-[#0a0a0a]/50 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all';

    const labelClass = compact
        ? 'text-sm font-medium text-zinc-700 dark:text-zinc-300'
        : 'text-sm font-semibold text-zinc-700 dark:text-zinc-300';

    const groupClass = compact ? 'space-y-1' : 'space-y-2';
    const gridClass = compact ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-6';

    return (
        <>
            {status?.error && (
                <div
                    className={compact ? 'p-3 text-sm rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400' : 'p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-sm font-medium'}
                    role="alert"
                >
                    {status.error}
                </div>
            )}

            <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
                className="absolute -left-[9999px] w-px h-px opacity-0"
                aria-hidden="true"
            />

            <div className={gridClass}>
                <div className={groupClass}>
                    <label className={labelClass}>Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className={inputClass}
                    />
                </div>

                <div className={groupClass}>
                    <label className={labelClass}>Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={inputClass}
                    />
                </div>
            </div>

            <div className={groupClass}>
                <label className={labelClass}>Subject</label>
                <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity"
                    className={inputClass}
                />
            </div>

            <div className={groupClass}>
                <div className="flex items-center justify-between">
                    <label className={labelClass}>Message</label>
                    <span className={compact ? 'text-xs font-mono text-zinc-400 dark:text-zinc-600' : 'text-xs font-mono text-zinc-500 dark:text-zinc-400'}>
                        {formData.message.length}/{MESSAGE_MAX_LENGTH}
                    </span>
                </div>
                <textarea
                    name="message"
                    id="message"
                    required
                    rows="6"
                    maxLength={MESSAGE_MAX_LENGTH}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className={`${inputClass} resize-y`}
                ></textarea>
            </div>
        </>
    );
}
