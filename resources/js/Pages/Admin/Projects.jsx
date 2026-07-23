import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '../../Components/Admin/AdminLayout';
import axios from 'axios';
import { useForm, router, usePage } from '@inertiajs/react';

const STATUSES = ['Completed', 'In Progress', 'Archived'];

function TechStackInput({ value, onChange, suggestions, onSkillAdded }) {
    // 1. Access adminSlug from Inertia props
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

    // Create a real Skill record from an unmatched tag, then add it as a tag
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

function ProjectFormFields({ data, setData, errors, availableSkills, onSkillAdded }) {
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
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium cursor-pointer transition-all">
                        <span>{data.image ? data.image.name : 'Choose Image'}</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image', e.target.files[0])}
                            className="hidden"
                        />
                    </label>
                    {errors.image && <p className="text-[11px] text-rose-500">{errors.image}</p>}
                </div>
            </div>
        </>
    );
}

function EditProjectModal({ project, availableSkills, onClose }) {
    // 2. Access adminSlug in the edit modal component
    const { adminSlug } = usePage().props;
    const [skillOptions, setSkillOptions] = useState(availableSkills);

    const { data, setData, post, processing, errors } = useForm({
        title: project.title,
        subtitle: project.subtitle || '',
        description: project.description,
        tech_stack: project.tech_stack || [],
        github_url: project.github_url || '',
        demo_url: project.demo_url || '',
        status: project.status,
        is_featured: project.is_featured,
        image: null,
        _method: 'put',
    });

    const handleSkillAdded = (name) => {
        setSkillOptions((prev) => [...prev, name]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Updated with correct route and adminSlug reference
        post(`/${adminSlug}/dashboard/projects/${project.id}`, {
            forceFormData: true,
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
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">Edit Project</h2>
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
                    <ProjectFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        availableSkills={skillOptions}
                        onSkillAdded={handleSkillAdded}
                    />

                    <div className="flex items-center justify-between pt-2">
                        <label className="inline-flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
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
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default function Projects({ projects, availableSkills }) {
    // 3. Access adminSlug in the main Projects page component
    const { adminSlug } = usePage().props;
    const [skillOptions, setSkillOptions] = useState(availableSkills);
    const [editingProject, setEditingProject] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        subtitle: '',
        description: '',
        tech_stack: [],
        github_url: '',
        demo_url: '',
        status: 'Completed',
        is_featured: false,
        image: null,
    });

    const handleSkillAdded = (name) => {
        setSkillOptions((prev) => [...prev, name]);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        // Route correctly points to projects collection endpoint
        post(`/${adminSlug}/dashboard/projects`, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this project?')) return;
        // Route correctly uses project ID param
        router.delete(`/${adminSlug}/dashboard/projects/${id}`);
    };

    const persistOrder = (newOrder) => {
        // Route points to reorder action
        router.post(`/${adminSlug}/dashboard/projects/reorder`, {
            order: newOrder.map((p) => p.id),
        });
    };

    const handleDragStart = (index) => setDraggedIndex(index);
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (index) => {
        if (draggedIndex === null || draggedIndex === index) {
            setDraggedIndex(null);
            return;
        }
        const newOrder = [...projects];
        const [moved] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(index, 0, moved);
        setDraggedIndex(null);
        persistOrder(newOrder);
    };

    return (
        <AdminLayout title="Projects" currentPath="/projects">
            <form onSubmit={handleCreate} className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4 mb-6">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Add Project</h2>
                <ProjectFormFields
                    data={data}
                    setData={setData}
                    errors={errors}
                    availableSkills={skillOptions}
                    onSkillAdded={handleSkillAdded}
                />

                <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
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
                        className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-xs transition-all disabled:opacity-50"
                    >
                        {processing ? 'Adding...' : 'Add Project'}
                    </button>
                </div>
            </form>

            <div className="space-y-2">
                {projects.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No projects added yet.</p>
                )}

                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className={`p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 transition-opacity flex items-center justify-between gap-3 ${
                            draggedIndex === index ? 'opacity-40' : 'opacity-100'
                        }`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-500 hidden sm:block shrink-0">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
                                    <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                                    <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                                </svg>
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                    {project.title}
                                    {project.is_featured && (
                                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                                            Featured
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono truncate">{project.status}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => setEditingProject(project)}
                                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(project.id)}
                                className="text-xs text-rose-500 hover:text-rose-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingProject && (
                <EditProjectModal
                    project={editingProject}
                    availableSkills={skillOptions}
                    onClose={() => setEditingProject(null)}
                />
            )}
        </AdminLayout>
    );
}