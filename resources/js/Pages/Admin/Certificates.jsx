import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { useForm, router, usePage } from '@inertiajs/react';

const STATUSES = ['Completed', 'In Progress', 'Expired'];

function CertificateFormFields({ data, setData, errors }) {
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
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Issuer</label>
                    <input
                        type="text"
                        value={data.issuer}
                        onChange={(e) => setData('issuer', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.issuer && <p className="text-[11px] text-rose-500">{errors.issuer}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Issue Date</label>
                    <input
                        type="date"
                        value={data.issue_date}
                        onChange={(e) => setData('issue_date', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.issue_date && <p className="text-[11px] text-rose-500">{errors.issue_date}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Expiration Date</label>
                    <input
                        type="date"
                        value={data.expiration_date}
                        onChange={(e) => setData('expiration_date', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.expiration_date && <p className="text-[11px] text-rose-500">{errors.expiration_date}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Credential ID</label>
                    <input
                        type="text"
                        value={data.credential_id}
                        onChange={(e) => setData('credential_id', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Credential URL</label>
                    <input
                        type="text"
                        value={data.credential_url}
                        onChange={(e) => setData('credential_url', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.credential_url && <p className="text-[11px] text-rose-500">{errors.credential_url}</p>}
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
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">Badge Image</label>
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

function EditCertificateModal({ certificate, onClose }) {
    const { adminSlug } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        title: certificate.title,
        issuer: certificate.issuer,
        issue_date: certificate.issue_date,
        expiration_date: certificate.expiration_date || '',
        credential_id: certificate.credential_id || '',
        credential_url: certificate.credential_url || '',
        status: certificate.status,
        image: null,
        _method: 'put',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/${adminSlug}/dashboard/certificates/${certificate.id}`, {
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
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">Edit Certificate</h2>
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
                    <CertificateFormFields data={data} setData={setData} errors={errors} />

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

export default function Certificates({ certificates }) {
    const { adminSlug } = usePage().props;
    const [editingCertificate, setEditingCertificate] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        issuer: '',
        issue_date: '',
        expiration_date: '',
        credential_id: '',
        credential_url: '',
        status: 'Completed',
        image: null,
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post(`/${adminSlug}/dashboard/certificates`, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this certificate?')) return;
        router.delete(`/${adminSlug}/dashboard/certificates/${id}`);
    };

    return (
        <AdminLayout title="Certificates" currentPath="/certificates">
            <form onSubmit={handleCreate} className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4 mb-6">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Add Certificate</h2>
                <CertificateFormFields data={data} setData={setData} errors={errors} />

                <div className="flex justify-end pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-xs transition-all disabled:opacity-50"
                    >
                        {processing ? 'Adding...' : 'Add Certificate'}
                    </button>
                </div>
            </form>

            <div className="space-y-2">
                {certificates.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No certificates added yet.</p>
                )}

                {certificates.map((certificate) => (
                    <div
                        key={certificate.id}
                        className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-3"
                    >
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                {certificate.title}
                                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                    {certificate.status}
                                </span>
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono truncate">
                                {certificate.issuer} - {certificate.issue_date}
                            </p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => setEditingCertificate(certificate)}
                                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(certificate.id)}
                                className="text-xs text-rose-500 hover:text-rose-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingCertificate && (
                <EditCertificateModal
                    certificate={editingCertificate}
                    onClose={() => setEditingCertificate(null)}
                />
            )}
        </AdminLayout>
    );
}