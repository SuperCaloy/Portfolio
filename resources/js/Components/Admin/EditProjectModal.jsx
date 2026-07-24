import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm, usePage } from '@inertiajs/react';
import ProjectFormFields from './ProjectFormFields';

export default function EditProjectModal({ project, availableSkills, onClose }) {
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
        remove_image: false,
        _method: 'put',
    });

    const handleSkillAdded = (name) => {
        setSkillOptions((prev) => [...prev, name]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4"                onClick={(e) => e.stopPropagation()}
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
                        project={project}
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