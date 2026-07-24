import React, { useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import ConfirmModal from '../Shared/ConfirmModal';

const STATUSES = ['Completed', 'In Progress', 'Archived'];

function TechStackInput({ value, onChange, suggestions, onSkillAdded }) {
    const { adminSlug } = usePage().props;
    const [input, setInput] = useState('');
    const [adding, setAdding] = useState(false);

    const addTag = (tag) => {
        const trimmed = tag.trim();
        if (!trimmed || value.includes(trimmed)) return;
        onChange([...value, trimmed]);
        setInput('');
    };

    const removeTag = (tag) => {
        onChange(value.filter((t) => t !== tag));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        }
    };

    const filteredSuggestions = suggestions.filter(
        (s) => !value.includes(s) && s.toLowerCase().includes(input.toLowerCase())
    );

    const trimmedInput = input.trim();
    const exactMatch = suggestions.some((s) => s.toLowerCase() === trimmedInput.toLowerCase());
    const canAddNew = trimmedInput.length > 0 && !exactMatch && !value.includes(trimmedInput);

    const handleAddNewSkill = () => {
        setAdding(true);
        axios.post(`/${adminSlug}/dashboard/skills`, { name: trimmedInput })
            .then(() => {
                onSkillAdded(trimmedInput);
                addTag(trimmedInput);
            })
            .catch(() => {})
            .finally(() => setAdding(false));
    };

    return (
        <div className="space-y-1.5">
            <div className="flex flex-wrap gap-1.5">
                {value.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px]"
                    >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-zinc-500 hover:text-rose-500">
                            x
                        </button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a tag and press Enter"
                className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
            {input && filteredSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {filteredSuggestions.slice(0, 6).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => addTag(s)}
                            className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono text-[11px] hover:border-zinc-400 dark:hover:border-zinc-600"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
            {input && filteredSuggestions.length === 0 && canAddNew && (
                <button
                    type="button"
                    onClick={handleAddNewSkill}
                    disabled={adding}
                    className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] hover:border-emerald-400 disabled:opacity-50"
                >
                    {adding ? 'Adding...' : `Add "${trimmedInput}" as new skill`}
                </button>
            )}
        </div>
    );
}

export default function ProjectFormFields({ data, setData, errors, availableSkills, onSkillAdded, project }) {
    const [confirmingRemove, setConfirmingRemove] = useState(false);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Subtitle</label>
                    <input
                        type="text"
                        value={data.subtitle}
                        onChange={(e) => setData('subtitle', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                </div>
            </div>

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
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Tech Stack</label>
                <TechStackInput
                    value={data.tech_stack}
                    onChange={(val) => setData('tech_stack', val)}
                    suggestions={availableSkills}
                    onSkillAdded={onSkillAdded}
                />
                {errors.tech_stack && <p className="text-[11px] text-rose-500">{errors.tech_stack}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">GitHub URL</label>
                    <input
                        type="text"
                        value={data.github_url}
                        onChange={(e) => setData('github_url', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.github_url && <p className="text-[11px] text-rose-500">{errors.github_url}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Demo URL</label>
                    <input
                        type="text"
                        value={data.demo_url}
                        onChange={(e) => setData('demo_url', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.demo_url && <p className="text-[11px] text-rose-500">{errors.demo_url}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Status</label>
                    <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">Cover Image</label>

                    {data.image ? (
                        <div className="flex items-center gap-2">
                            <img src={URL.createObjectURL(data.image)} alt="Preview" className="w-10 h-10 rounded-md object-cover border border-zinc-200 dark:border-zinc-800" />
                            <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[140px]">{data.image.name}</span>
                            <button type="button" onClick={() => setData('image', null)} className="text-zinc-500 hover:text-rose-500 text-xs">
                                x
                            </button>
                        </div>
                    ) : project?.image_path && !data.remove_image ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="w-10 h-10 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={project.image_path}
                                    alt="Current cover"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[140px]">
                                {project.image_path.split('/').pop()}
                            </span>
                            <label className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium cursor-pointer">
                                Replace
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => { setData('image', e.target.files[0]); setData('remove_image', false); }}
                                    className="hidden"
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => setConfirmingRemove(true)}
                                className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-[11px] font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium cursor-pointer transition-all">
                            <span>Choose Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => { setData('image', e.target.files[0]); setData('remove_image', false); }}
                                className="hidden"
                            />
                        </label>
                    )}
                    {errors.image && <p className="text-[11px] text-rose-500">{errors.image}</p>}
                </div>
            </div>

            {confirmingRemove && (
                <ConfirmModal
                    title="Remove cover image?"
                    message="The current cover image will be removed once you save."
                    danger
                    onConfirm={() => {
                        setData('remove_image', true);
                        setConfirmingRemove(false);
                    }}
                    onCancel={() => setConfirmingRemove(false)}
                />
            )}
        </>
    );
}