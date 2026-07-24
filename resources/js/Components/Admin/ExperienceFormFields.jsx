import React, { useState } from 'react';

function AchievementsInput({ value, onChange }) {
    const [input, setInput] = useState('');

    const addItem = (item) => {
        const trimmed = item.trim();
        if (!trimmed) return;
        onChange([...value, trimmed]);
        setInput('');
    };

    const removeItem = (item) => {
        onChange(value.filter((i) => i !== item));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem(input);
        }
    };

    return (
        <div className="space-y-1.5">
            <div className="flex flex-col gap-1.5">
                {value.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs"
                    >
                        <span className="truncate">{item}</span>
                        <button type="button" onClick={() => removeItem(item)} className="text-zinc-500 hover:text-rose-500 shrink-0">
                            x
                        </button>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type an achievement and press Enter"
                className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
        </div>
    );
}

export default function ExperienceFormFields({ data, setData, errors }) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Company</label>
                    <input
                        type="text"
                        value={data.company}
                        onChange={(e) => setData('company', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.company && <p className="text-[11px] text-rose-500">{errors.company}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Role</label>
                    <input
                        type="text"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.role && <p className="text-[11px] text-rose-500">{errors.role}</p>}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Location</label>
                <input
                    type="text"
                    value={data.location}
                    onChange={(e) => setData('location', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Start Date</label>
                    <input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData('start_date', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.start_date && <p className="text-[11px] text-rose-500">{errors.start_date}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">End Date</label>
                    <input
                        type="date"
                        value={data.end_date}
                        disabled={data.is_current}
                        onChange={(e) => setData('end_date', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 disabled:opacity-50"
                    />
                    {errors.end_date && <p className="text-[11px] text-rose-500">{errors.end_date}</p>}
                </div>
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                <input
                    type="checkbox"
                    checked={data.is_current}
                    onChange={(e) => {
                        setData('is_current', e.target.checked);
                        if (e.target.checked) setData('end_date', '');
                    }}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                />
                Currently working here
            </label>

            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                <textarea
                    rows="3"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
                />
                {errors.description && <p className="text-[11px] text-rose-500">{errors.description}</p>}
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Achievements</label>
                <AchievementsInput value={data.achievements} onChange={(val) => setData('achievements', val)} />
            </div>
        </>
    );
}