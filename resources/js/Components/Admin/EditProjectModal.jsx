import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import ProjectFormFields from './ProjectFormFields';
import AdminEditModal from './AdminEditModal';
import ConfirmModal from '../Shared/ConfirmModal';

export default function EditProjectModal({ project, availableSkills, onClose }) {
    const { adminSlug } = usePage().props;
    const [skillOptions, setSkillOptions] = useState(availableSkills);
    const [confirmingSave, setConfirmingSave] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: project.title,
        subtitle: project.subtitle || '',
        description: project.description,
        tech_stack: project.tech_stack || [],
        github_url: project.github_url || '',
        demo_url: project.demo_url || '',
        status: project.status,
        start_date: project.start_date ? project.start_date.substring(0, 10) : '',
        end_date: project.end_date ? project.end_date.substring(0, 10) : '',
        is_featured: project.is_featured,
        image: null,
        remove_image: false,
        _method: 'put',
    });

    const handleSkillAdded = (name) => {
        setSkillOptions((prev) => [...prev, name]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmingSave(true);
    };

    const confirmSave = () => {
        setConfirmingSave(false);
        post(`/${adminSlug}/dashboard/projects/${project.id}`, {
            forceFormData: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <AdminEditModal title="Edit Project" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <ProjectFormFields
                    data={data}
                    setData={setData}
                    errors={errors}
                    availableSkills={skillOptions}
                    onSkillAdded={handleSkillAdded}
                    project={project}
                />

                <div className="flex items-center justify-between pt-2">
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

            {confirmingSave && (
                <ConfirmModal
                    title="Save changes to this project?"
                    message="The project will be updated with the details you entered."
                    onConfirm={confirmSave}
                    onCancel={() => setConfirmingSave(false)}
                />
            )}
        </AdminEditModal>
    );
}