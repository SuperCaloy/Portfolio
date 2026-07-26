import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import ConfirmModal from '../../Components/Shared/ConfirmModal';

export default function Profile({ profile }) {
    const { adminSlug } = usePage().props;
    const [avatarPreview, setAvatarPreview] = useState(profile.avatar_path || null);
    const [confirmingRemoveAvatar, setConfirmingRemoveAvatar] = useState(false);
    const [confirmingSave, setConfirmingSave] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        full_name: profile.full_name || '',
        professional_title: profile.professional_title || '',
        bio: profile.bio || '',
        about_me: profile.about_me || '',
        email: profile.email || '',
        phone: profile.phone || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        avatar: null,
        remove_avatar: false,
        resume: null,
        _method: 'put',
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('avatar', file);
        setData('remove_avatar', false);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleRemoveAvatar = () => {
        setData('avatar', null);
        setData('remove_avatar', true);
        setAvatarPreview(null);
        setConfirmingRemoveAvatar(false);
    };

    // Opens a confirm step instead of saving immediately, matching the
    // pattern already used for destructive actions across the admin panel.
    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmingSave(true);
    };

    const confirmSave = () => {
        post(`/${adminSlug}/dashboard/profile`, { forceFormData: true });
        setConfirmingSave(false);
    };

    const field = (name, label, type = 'text') => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
            <input
                type={type}
                value={data[name]}
                onChange={(e) => setData(name, e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
            {errors[name] && <p className="text-xs text-rose-500">{errors[name]}</p>}
        </div>
    );

    return (
        <AdminLayout title="Profile" currentPath={`/${adminSlug}/dashboard/profile`}>
            <form onSubmit={handleSubmit} className="max-w-6xl space-y-6">
                {recentlySuccessful && (
                    <div className="p-3 text-sm rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400">
                        Profile updated.
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
                            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Basic Info</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {field('full_name', 'Full Name')}
                                {field('professional_title', 'Professional Title')}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Bio (short, shown under name)</label>
                                <textarea
                                    rows="2"
                                    maxLength={500}
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-none"
                                />
                                {errors.bio && <p className="text-xs text-rose-500">{errors.bio}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">About Me (full paragraph)</label>
                                <textarea
                                    rows="6"
                                    value={data.about_me}
                                    onChange={(e) => setData('about_me', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-none"
                                />
                                {errors.about_me && <p className="text-xs text-rose-500">{errors.about_me}</p>}
                            </div>
                        </div>

                        <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
                            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Contact & Links</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {field('email', 'Email', 'email')}
                                {field('phone', 'Phone')}
                                {field('github_url', 'GitHub URL')}
                                {field('linkedin_url', 'LinkedIn URL')}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-sm transition-all disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
                            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Avatar</h2>

                            <div className="flex flex-col items-center gap-4">
                                <div
                                    onClick={() => avatarPreview && setPreviewOpen(true)}
                                    className={`w-28 h-28 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center shrink-0 ${avatarPreview ? 'cursor-pointer' : ''}`}
                                >
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs text-zinc-400 text-center px-1">No photo</span>
                                    )}
                                </div>

                                {avatarPreview ? (
                                    <div className="flex items-center gap-2 flex-wrap justify-center">
                                        <label className="px-2.5 py-1.5 rounded-md bg-white hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium cursor-pointer">
                                            Replace
                                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmingRemoveAvatar(true)}
                                            className="px-2.5 py-1.5 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium cursor-pointer transition-all">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Choose Photo</span>
                                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                    </label>
                                )}
                                {errors.avatar && <p className="text-xs text-rose-500">{errors.avatar}</p>}
                            </div>
                        </div>

                        <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
                            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Resume</h2>
                            <label className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium cursor-pointer transition-all">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="truncate">{data.resume ? data.resume.name : 'Choose Resume (PDF)'}</span>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => setData('resume', e.target.files[0])}
                                    className="hidden"
                                />
                            </label>
                            {errors.resume && <p className="text-xs text-rose-500">{errors.resume}</p>}
                            {profile.resume_path && (
                              <a
                                    href={profile.resume_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-4 block text-center"
                                >
                                    View current resume
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {confirmingRemoveAvatar && (
                <ConfirmModal
                    title="Remove avatar?"
                    message="The current avatar will be removed once you save."
                    danger
                    onConfirm={handleRemoveAvatar}
                    onCancel={() => setConfirmingRemoveAvatar(false)}
                />
            )}

            {confirmingSave && (
                <ConfirmModal
                    title="Save profile changes?"
                    message="Your profile information will be updated with the details you entered."
                    onConfirm={confirmSave}
                    onCancel={() => setConfirmingSave(false)}
                />
            )}

            {previewOpen && avatarPreview && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md"
                    onClick={() => setPreviewOpen(false)}
                >
                    <button
                        type="button"
                        onClick={() => setPreviewOpen(false)}
                        className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={avatarPreview}
                        alt="Avatar full preview"
                        className="max-w-full max-h-[80vh] rounded-xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}