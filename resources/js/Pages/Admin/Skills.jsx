import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import ConfirmModal from '../../Components/Shared/ConfirmModal';
import Pagination from '../../Components/Shared/Pagination';
import { BrandIcon, resolveProjectTechName } from '../../utils/skillIcon';

const CATEGORIES = ['Backend', 'Frontend', 'Database', 'DevOps', 'Tools'];

// Shows a live preview of the icon that will be used, based on the
// override field if filled, otherwise guessed from the name typed.
function IconPreview({ name, iconOverride }) {
    const [debouncedName, setDebouncedName] = useState(name);
    const [debouncedOverride, setDebouncedOverride] = useState(iconOverride);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(name);
            setDebouncedOverride(iconOverride);
        }, 400);
        return () => clearTimeout(timer);
    }, [name, iconOverride]);

    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                {status === 'matched' ? (
                    <BrandIcon name={debouncedOverride || debouncedName} className="w-4 h-4 shrink-0" onStatusChange={setStatus} />
                ) : (
                    <>
                        <span className="w-4 h-4 shrink-0 rounded-full border border-dashed border-zinc-400 dark:border-zinc-600" />
                        <BrandIcon name={debouncedOverride || debouncedName} className="hidden" onStatusChange={setStatus} />
                    </>
                )}
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {status === 'matched' ? 'Icon matched' : status === 'none' ? 'No icon match, will show as text only' : 'Checking...'}
                </span>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Override must match the exact slug from{' '}
                <a href="https://simpleicons.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600 dark:hover:text-zinc-400">
                    simpleicons.org
                </a>
                , for example javascript, not js.
            </p>
        </div>
    );
}

function EditSkillModal({ skill, onClose, adminSlug }) {
    const [confirmingSave, setConfirmingSave] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: skill.name,
        category: skill.category,
        icon_name: skill.icon_name || '',
        is_featured: skill.is_featured,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmingSave(true);
    };

    const confirmSave = () => {
        setConfirmingSave(false);
        put(`/${adminSlug}/dashboard/skills/${skill.id}`, {
            onSuccess: () => onClose(),
        });
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/90 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Skill</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                        />
                        {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Icon Override (optional)</label>
                        <input
                            type="text"
                            value={data.icon_name}
                            onChange={(e) => setData('icon_name', e.target.value)}
                            placeholder="Leave blank to auto match from name"
                            className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                        />
                        <IconPreview name={data.name} iconOverride={data.icon_name} />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={(e) => setData('is_featured', e.target.checked)}
                                className="rounded border-zinc-300 dark:border-zinc-700"
                            />
                            Featured
                        </label>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-sm font-medium disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {confirmingSave && (
                <ConfirmModal
                    title="Save changes to this skill?"
                    message="The skill will be updated with the details you entered."
                    onConfirm={confirmSave}
                    onCancel={() => setConfirmingSave(false)}
                />
            )}
        </div>,
        document.body
    );
}

export default function Skills({ skills, filters }) {
    const { adminSlug } = usePage().props;
    const [editingSkill, setEditingSkill] = useState(null);
    const [deletingSkillId, setDeletingSkillId] = useState(null);
    const [confirmingCreate, setConfirmingCreate] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimer = useRef(null);
    const isFirstRender = useRef(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category: 'Backend',
        icon_name: '',
        is_featured: false,
    });

    const handleCreate = (e) => {
        e.preventDefault();
        setConfirmingCreate(true);
    };

    const confirmCreate = () => {
        setConfirmingCreate(false);
        post(`/${adminSlug}/dashboard/skills`, {
            onSuccess: () => reset(),
        });
    };

    const confirmDelete = () => {
        router.delete(`/${adminSlug}/dashboard/skills/${deletingSkillId}`);
        setDeletingSkillId(null);
    };

    // Debounced server side search by name, resets to page 1 each time.
    // Marked silent so AdminLayout's global overlay does not cover the list
    // while typing, the input's own spinner handles that feedback instead.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            router.get(`/${adminSlug}/dashboard/skills`, { search, page: 1 }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                showProgress: false,
                headers: { 'X-Silent-Navigation': 'true' },
                onStart: () => setIsSearching(true),
                onFinish: () => setIsSearching(false),
            });
        }, 550);

        return () => clearTimeout(debounceTimer.current);
    }, [search]);

    return (
        <AdminLayout title="Skills" currentPath={`/${adminSlug}/dashboard/skills`}>
            <form onSubmit={handleCreate} className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4 mb-6">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Add Skill</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                        />
                        {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Icon Override (optional)</label>
                        <input
                            type="text"
                            value={data.icon_name}
                            onChange={(e) => setData('icon_name', e.target.value)}
                            placeholder="Leave blank to auto match from name"
                            className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                        />
                        <IconPreview name={data.name} iconOverride={data.icon_name} />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                        <input
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={(e) => setData('is_featured', e.target.checked)}
                            className="rounded border-zinc-300 dark:border-zinc-700"
                        />
                        Featured
                    </label>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-sm transition-all disabled:opacity-50"
                    >
                        {processing ? 'Adding...' : 'Add Skill'}
                    </button>
                </div>
            </form>

            <div className="relative mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search skills by name"
                    className="w-full px-3 py-2 pr-9 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
                {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-300 animate-spin" />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                {skills.data.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {search ? 'No skills match your search.' : 'No skills added yet.'}
                    </p>
                )}

                {skills.data.map((skill) => (
                    <div
                        key={skill.id}
                        className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                {skill.name}
                                {skill.is_featured && (
                                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                                        Featured
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono truncate">{skill.category}</p>
                        </div>

                        <div className="flex gap-1 shrink-0">
                            <button
                                onClick={() => setEditingSkill(skill)}
                                className="px-2.5 py-1.5 rounded-md text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setDeletingSkillId(skill.id)}
                                className="px-2.5 py-1.5 rounded-md text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination links={skills.links} />

            {editingSkill && (
                <EditSkillModal skill={editingSkill} onClose={() => setEditingSkill(null)} adminSlug={adminSlug} />
            )}

            {confirmingCreate && (
                <ConfirmModal
                    title="Add this skill?"
                    message="The skill will be added to your public tech stack list."
                    onConfirm={confirmCreate}
                    onCancel={() => setConfirmingCreate(false)}
                />
            )}

            {deletingSkillId && (
                <ConfirmModal
                    title="Delete this skill?"
                    message="This action cannot be undone."
                    danger
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletingSkillId(null)}
                />
            )}
        </AdminLayout>
    );
}