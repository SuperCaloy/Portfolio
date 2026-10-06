import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import ExperienceFormFields from './ExperienceFormFields';
import AdminEditModal from './AdminEditModal';
import ConfirmModal from '../Shared/ConfirmModal';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

export default function EditExperienceModal({ experience, onClose }) {
    const { adminSlug } = usePage().props;
    const [confirmingSave, setConfirmingSave] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        company: experience.company,
        role: experience.role,
        location: experience.location || '',
        start_date: formatDate(experience.start_date),
        end_date: formatDate(experience.end_date),
        is_current: experience.is_current,
        description: experience.description,
        achievements: experience.achievements || [],
        _method: 'put',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmingSave(true);
    };

    const confirmSave = () => {
        setConfirmingSave(false);
        post(`/${adminSlug}/dashboard/experience/${experience.id}`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <AdminEditModal title="Edit Experience" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <ExperienceFormFields data={data} setData={setData} errors={errors} />

                <div className="flex items-center justify-end gap-2 pt-2">
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
            </form>

            {confirmingSave && (
                <ConfirmModal
                    title="Save changes to this experience entry?"
                    message="The entry will be updated with the details you entered."
                    onConfirm={confirmSave}
                    onCancel={() => setConfirmingSave(false)}
                />
            )}
        </AdminEditModal>
    );
}