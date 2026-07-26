import React, { useState } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { useForm, router, usePage } from '@inertiajs/react';
import ExperienceFormFields from '../../Components/Admin/ExperienceFormFields';
import EditExperienceModal from '../../Components/Admin/EditExperienceModal';
import ViewExperienceModal from '../../Components/Shared/ViewExperienceModal';
import ConfirmModal from '../../Components/Shared/ConfirmModal';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

export default function Experience({ experiences }) {
    const { adminSlug } = usePage().props;
    const [editingExperience, setEditingExperience] = useState(null);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [deletingExperienceId, setDeletingExperienceId] = useState(null);
    const [confirmingCreate, setConfirmingCreate] = useState(false);
    const [search, setSearch] = useState('');

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
        setConfirmingCreate(true);
    };

    const confirmCreate = () => {
        setConfirmingCreate(false);
        post(`/${adminSlug}/dashboard/experience`, {
            onSuccess: () => reset(),
        });
    };

    const confirmDelete = () => {
        router.delete(`/${adminSlug}/dashboard/experience/${deletingExperienceId}`);
        setDeletingExperienceId(null);
    };

    const filteredExperiences = experiences.filter((experience) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        const inRole = experience.role?.toLowerCase().includes(query);
        const inCompany = experience.company?.toLowerCase().includes(query);
        return inRole || inCompany;
    });

    return (
        <AdminLayout title="Experience" currentPath="/experience">
            <form onSubmit={handleCreate} className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4 mb-6">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Add Experience</h2>
                <ExperienceFormFields data={data} setData={setData} errors={errors} />

                <div className="flex justify-end pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-sm transition-all disabled:opacity-50"
                    >
                        {processing ? 'Adding...' : 'Add Experience'}
                    </button>
                </div>
            </form>

            <div className="mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search experience by role or company"
                    className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
            </div>

            <div className="space-y-2">
                {experiences.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No experience entries added yet.</p>
                )}

                {experiences.length > 0 && filteredExperiences.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No experience entries match your search.</p>
                )}

                {filteredExperiences.map((experience) => (
                    <div
                        key={experience.id}
                        onClick={() => setSelectedExperience(experience)}
                        className="group w-full text-left p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-all flex flex-wrap items-center justify-between gap-3 cursor-pointer"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                {experience.role} at {experience.company}
                                {experience.is_current && (
                                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                                        Current
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono truncate">
                                {formatDate(experience.start_date)} to {experience.is_current ? 'Present' : formatDate(experience.end_date)}
                            </p>
                            <span className="inline-block text-xs font-mono text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                View details →
                            </span>
                        </div>

                        <div className="flex gap-1 shrink-0">
                            <button
                                onClick={(e) => { e.stopPropagation(); setEditingExperience(experience); }}
                                className="px-2.5 py-1.5 rounded-md text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setDeletingExperienceId(experience.id); }}
                                className="px-2.5 py-1.5 rounded-md text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedExperience && (
                <ViewExperienceModal
                    experience={selectedExperience}
                    onClose={() => setSelectedExperience(null)}
                    onEdit={(exp) => {
                        setSelectedExperience(null);
                        setEditingExperience(exp);
                    }}
                />
            )}

            {editingExperience && (
                <EditExperienceModal
                    key={editingExperience.id}
                    experience={editingExperience}
                    onClose={() => setEditingExperience(null)}
                />
            )}

            {confirmingCreate && (
                <ConfirmModal
                    title="Add this experience entry?"
                    message="The entry will be added to your public experience list."
                    onConfirm={confirmCreate}
                    onCancel={() => setConfirmingCreate(false)}
                />
            )}

            {deletingExperienceId && (
                <ConfirmModal
                    title="Delete this experience entry?"
                    message="This action cannot be undone."
                    danger
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletingExperienceId(null)}
                />
            )}
        </AdminLayout>
    );
}