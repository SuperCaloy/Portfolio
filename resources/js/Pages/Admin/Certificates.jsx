import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { useForm, router, usePage } from '@inertiajs/react';
import CertificateFormFields from '../../Components/Admin/CertificateFormFields';
import EditCertificateModal from '../../Components/Admin/EditCertificateModal';
import ViewCertificateModal from '../../Components/Shared/ViewCertificateModal';
import ConfirmModal from '../../Components/Shared/ConfirmModal';
import Pagination from '../../Components/Shared/Pagination';

export default function Certificates({ certificates, filters }) {
    const { adminSlug } = usePage().props;
    const [editingCertificate, setEditingCertificate] = useState(null);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [deletingCertificateId, setDeletingCertificateId] = useState(null);
    const [confirmingCreate, setConfirmingCreate] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimer = useRef(null);
    const isFirstRender = useRef(true);

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
        setConfirmingCreate(true);
    };

    const confirmCreate = () => {
        setConfirmingCreate(false);
        post(`/${adminSlug}/dashboard/certificates`, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const confirmDelete = () => {
        router.delete(`/${adminSlug}/dashboard/certificates/${deletingCertificateId}`);
        setDeletingCertificateId(null);
    };

    // Debounced server side search by title or issuer, resets to page 1 each time.
    // Marked silent so AdminLayout's global overlay does not cover the list
    // while typing, the input's own spinner handles that feedback instead.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            router.get(`/${adminSlug}/dashboard/certificates`, { search, page: 1 }, {
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
        <AdminLayout title="Certificates" currentPath={`/${adminSlug}/dashboard/certificates`}>
            <form onSubmit={handleCreate} className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4 mb-6">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Add Certificate</h2>
                <CertificateFormFields data={data} setData={setData} errors={errors} />

                <div className="flex justify-end pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-sm transition-all disabled:opacity-50"
                    >
                        {processing ? 'Adding...' : 'Add Certificate'}
                    </button>
                </div>
            </form>

            <div className="relative mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search certificates by title or issuer"
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
                {certificates.data.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {search ? 'No certificates match your search.' : 'No certificates added yet.'}
                    </p>
                )}

                {certificates.data.map((certificate) => (
                    <div
                        key={certificate.id}
                        onClick={() => setSelectedCertificate(certificate)}
                        className="group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-all flex flex-wrap items-center justify-between gap-3 cursor-pointer"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                {certificate.title}
                                <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                    {certificate.status}
                                </span>
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono truncate">
                                {certificate.issuer} - {certificate.issue_date}
                            </p>
                            <span className="inline-block text-xs font-mono text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                View details →
                            </span>
                        </div>

                        <div className="flex gap-1 shrink-0">
                            <button
                                onClick={(e) => { e.stopPropagation(); setEditingCertificate(certificate); }}
                                className="px-2.5 py-1.5 rounded-md text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setDeletingCertificateId(certificate.id); }}
                                className="px-2.5 py-1.5 rounded-md text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination links={certificates.links} />

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

            {confirmingCreate && (
                <ConfirmModal
                    title="Add this certificate?"
                    message="The certificate will be added to your public certificates list."
                    onConfirm={confirmCreate}
                    onCancel={() => setConfirmingCreate(false)}
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