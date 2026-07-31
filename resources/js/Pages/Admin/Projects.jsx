import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { useForm, router, usePage } from '@inertiajs/react';
import ProjectFormFields from '../../Components/Admin/ProjectFormFields';
import EditProjectModal from '../../Components/Admin/EditProjectModal';
import ViewProjectModal from '../../Components/Shared/ViewProjectModal';
import ConfirmModal from '../../Components/Shared/ConfirmModal';
import Pagination from '../../Components/Shared/Pagination';

export default function Projects({ projects, availableSkills, filters }) {
    const { adminSlug } = usePage().props;
    const [skillOptions, setSkillOptions] = useState(availableSkills);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [deletingProjectId, setDeletingProjectId] = useState(null);
    const [confirmingCreate, setConfirmingCreate] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimer = useRef(null);
    const isFirstRender = useRef(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        subtitle: '',
        description: '',
        tech_stack: [],
        github_url: '',
        demo_url: '',
        status: 'Completed',
        start_date: '',
        end_date: '',
        is_featured: false,
        image: null,
    });

    const handleSkillAdded = (name) => {
        setSkillOptions((prev) => [...prev, name]);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        setConfirmingCreate(true);
    };

    const confirmCreate = () => {
        setConfirmingCreate(false);
        post(`/${adminSlug}/dashboard/projects`, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const confirmDelete = () => {
        router.delete(`/${adminSlug}/dashboard/projects/${deletingProjectId}`);
        setDeletingProjectId(null);
    };

    // Debounced server side search by title or tech stack, resets to page 1 each time.
    // Marked silent so AdminLayout's global overlay does not cover the list
    // while typing, the input's own spinner handles that feedback instead.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            router.get(`/${adminSlug}/dashboard/projects`, { search, page: 1 }, {
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
        <AdminLayout title="Projects" currentPath={`/${adminSlug}/dashboard/projects`}>
            <form onSubmit={handleCreate} className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4 mb-6">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Add Project</h2>
                <ProjectFormFields
                    data={data}
                    setData={setData}
                    errors={errors}
                    availableSkills={skillOptions}
                    onSkillAdded={handleSkillAdded}
                />

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
                        {processing ? 'Adding...' : 'Add Project'}
                    </button>
                </div>
            </form>

            <div className="relative mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects by title or tech stack"
                    className="w-full px-3 py-2 pr-9 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
                {isSearching && !search && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-300 animate-spin" />
                    </div>
                )}
                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    >
                        {isSearching ? (
                            <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-300 animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {projects.data.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {search ? 'No projects match your search.' : 'No projects added yet.'}
                    </p>
                )}

                {projects.data.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-all flex flex-wrap items-center justify-between gap-3 cursor-pointer"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                {project.title}
                                {project.is_featured && (
                                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                                        Featured
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono truncate">{project.status}</p>
                            <span className="inline-block text-xs font-mono text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                View details →
                            </span>
                        </div>

                        <div className="flex gap-1 shrink-0">
                            <button
                                onClick={(e) => { e.stopPropagation(); setEditingProject(project); }}
                                className="px-2.5 py-1.5 rounded-md text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setDeletingProjectId(project.id); }}
                                className="px-2.5 py-1.5 rounded-md text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination links={projects.links} />

            {selectedProject && (
                <ViewProjectModal
                    project={selectedProject}
                    skills={skillOptions}
                    onClose={() => setSelectedProject(null)}
                    onEdit={(proj) => {
                        setSelectedProject(null);
                        setEditingProject(proj);
                    }}
                />
            )}

            {editingProject && (
                <EditProjectModal
                    project={editingProject}
                    availableSkills={skillOptions}
                    onClose={() => setEditingProject(null)}
                />
            )}

            {confirmingCreate && (
                <ConfirmModal
                    title="Add this project?"
                    message="The project will be added to your public projects list."
                    onConfirm={confirmCreate}
                    onCancel={() => setConfirmingCreate(false)}
                />
            )}

            {deletingProjectId && (
                <ConfirmModal
                    title="Delete this project?"
                    message="This action cannot be undone."
                    danger
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletingProjectId(null)}
                />
            )}
        </AdminLayout>
    );
}