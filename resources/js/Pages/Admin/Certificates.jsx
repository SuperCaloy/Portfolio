import React, { useState } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { useForm, router, usePage } from '@inertiajs/react';
import CertificateFormFields from '../../Components/Admin/CertificateFormFields';
import EditCertificateModal from '../../Components/Admin/EditCertificateModal';
import ViewCertificateModal from '../../Components/Shared/ViewCertificateModal';
import ConfirmModal from '../../Components/Shared/ConfirmModal';

export default function Certificates({ certificates }) {
    const { adminSlug } = usePage().props;
    const [editingCertificate, setEditingCertificate] = useState(null);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [deletingCertificateId, setDeletingCertificateId] = useState(null);
    const [search, setSearch] = useState('');

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

    const confirmDelete = () => {
        router.delete(`/${adminSlug}/dashboard/certificates/${deletingCertificateId}`);
        setDeletingCertificateId(null);
    };

    const filteredCertificates = certificates.filter((certificate) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        const inTitle = certificate.title?.toLowerCase().includes(query);
        const inIssuer = certificate.issuer?.toLowerCase().includes(query);
        return inTitle || inIssuer;
    });

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

            <div className="mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search certificates by title or issuer"
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
            </div>

            <div className="space-y-2">
                {certificates.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No certificates added yet.</p>
                )}

                {certificates.length > 0 && filteredCertificates.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No certificates match your search.</p>
                )}

                {filteredCertificates.map((certificate) => (
                    <div
                        key={certificate.id}
                        onClick={() => setSelectedCertificate(certificate)}
                        className="group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-all flex items-center justify-between gap-3 cursor-pointer"
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
                            <span className="inline-block text-[11px] font-mono text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                View details →
                            </span>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <span
                                onClick={(e) => { e.stopPropagation(); setEditingCertificate(certificate); }}
                                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                            >
                                Edit
                            </span>
                            <span
                                onClick={(e) => { e.stopPropagation(); setDeletingCertificateId(certificate.id); }}
                                className="text-xs text-rose-500 hover:text-rose-600 cursor-pointer"
                            >
                                Delete
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedCertificate && (
                <ViewCertificateModal
                    certificate={selectedCertificate}
                    onClose={() => setSelectedCertificate(null)}
                    onEdit={(cert) => {
                        setSelectedCertificate(null);
                        setEditingCertificate(cert);
                    }}
                />
            )}

            {editingCertificate && (
                <EditCertificateModal
                    certificate={editingCertificate}
                    onClose={() => setEditingCertificate(null)}
                />
            )}

            {deletingCertificateId && (
                <ConfirmModal
                    title="Delete this certificate?"
                    message="This action cannot be undone."
                    danger
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletingCertificateId(null)}
                />
            )}
        </AdminLayout>
    );
}