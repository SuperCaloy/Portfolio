import React, { useState } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { useForm, router, usePage } from '@inertiajs/react';
import ProjectFormFields from '../../Components/Admin/ProjectFormFields';
import EditProjectModal from '../../Components/Admin/EditProjectModal';
import ViewProjectModal from '../../Components/Shared/ViewProjectModal';
import ConfirmModal from '../../Components/Shared/ConfirmModal';

export default function Projects({ projects, availableSkills }) {
    const { adminSlug } = usePage().props;
    const [skillOptions, setSkillOptions] = useState(availableSkills);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [deletingProjectId, setDeletingProjectId] = useState(null);
    const [search, setSearch] = useState('');

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
        post(`/${adminSlug}/dashboard/projects`, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const confirmDelete = () => {
        router.delete(`/${adminSlug}/dashboard/projects/${deletingProjectId}`);
        setDeletingProjectId(null);
    };

    const persistOrder = (newOrder) => {
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

    const filteredProjects = projects.filter((project) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        const inTitle = project.title?.toLowerCase().includes(query);
        const inTech = (project.tech_stack || []).some((tag) => tag.toLowerCase().includes(query));
        return inTitle || inTech;
    });

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

            <div className="mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects by title or tech stack"
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
            </div>

            <div className="space-y-2">
                {projects.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No projects added yet.</p>
                )}

                {projects.length > 0 && filteredProjects.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No projects match your search.</p>
                )}

                {filteredProjects.map((project, index) => (
                    <div
                        key={project.id}
                        draggable={!search.trim()}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        onClick={() => setSelectedProject(project)}
                        className={`group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            draggedIndex === index ? 'opacity-40' : 'opacity-100'
                        }`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-500 hidden sm:block shrink-0"
                            >
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
                                <span className="inline-block text-[11px] font-mono text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                    View details →
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <span
                                onClick={(e) => { e.stopPropagation(); setEditingProject(project); }}
                                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                            >
                                Edit
                            </span>
                            <span
                                onClick={(e) => { e.stopPropagation(); setDeletingProjectId(project.id); }}
                                className="text-xs text-rose-500 hover:text-rose-600 cursor-pointer"
                            >
                                Delete
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedProject && (
                <ViewProjectModal
                    project={selectedProject}
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