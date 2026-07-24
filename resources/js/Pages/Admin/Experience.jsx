import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { useForm, router, usePage } from '@inertiajs/react';

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

function ExperienceFormFields({ data, setData, errors }) {
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

function EditExperienceModal({ experience, onClose }) {
    const { adminSlug } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        company: experience.company,
        role: experience.role,
        location: experience.location || '',
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        is_current: experience.is_current,
        description: experience.description,
        achievements: experience.achievements || [],
        _method: 'put',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/${adminSlug}/dashboard/experience/${experience.id}`, {
            onSuccess: () => onClose(),
        });
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/90 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">Edit Experience</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <ExperienceFormFields data={data} setData={setData} errors={errors} />

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-medium disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default function Experience({ experiences }) {
    const { adminSlug } = usePage().props;
    const [editingExperience, setEditingExperience] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        company: '',
        role: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        achievements: [],
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post(`/${adminSlug}/dashboard/experience`, {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this experience entry?')) return;
        router.delete(`/${adminSlug}/dashboard/experience/${id}`);
    };

    return (
        <AdminLayout title="Experience" currentPath="/experience">
            <form onSubmit={handleCreate} className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4 mb-6">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Add Experience</h2>
                <ExperienceFormFields data={data} setData={setData} errors={errors} />

                <div className="flex justify-end pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-xs transition-all disabled:opacity-50"
                    >
                        {processing ? 'Adding...' : 'Add Experience'}
                    </button>
                </div>
            </form>

            <div className="space-y-2">
                {experiences.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No experience entries added yet.</p>
                )}

                {experiences.map((experience) => (
                    <div
                        key={experience.id}
                        className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-3"
                    >
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                {experience.role} at {experience.company}
                                {experience.is_current && (
                                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                                        Current
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono truncate">
                                {experience.start_date} to {experience.is_current ? 'Present' : experience.end_date}
                            </p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => setEditingExperience(experience)}
                                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(experience.id)}
                                className="text-xs text-rose-500 hover:text-rose-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingExperience && (
                <EditExperienceModal
                    experience={editingExperience}
                    onClose={() => setEditingExperience(null)}
                />
            )}
        </AdminLayout>
    );
}