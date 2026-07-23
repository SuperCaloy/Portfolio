import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../Components/Admin/AdminLayout';

export default function Profile({ profile }) {
    const { adminSlug } = usePage().props;
    const [avatarPreview, setAvatarPreview] = useState(profile.avatar_path || null);

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
        resume: null,
        _method: 'put',
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('avatar', file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/${adminSlug}/dashboard/profile`, { forceFormData: true });
    };

    const field = (name, label, type = 'text') => (
        <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
            <input
                type={type}
                value={data[name]}
                onChange={(e) => setData(name, e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
            {errors[name] && <p className="text-[11px] text-rose-500">{errors[name]}</p>}
        </div>
    );

    return (
        <AdminLayout title="Profile" currentPath={`/${adminSlug}/dashboard/profile`}>
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {recentlySuccessful && (
                    <div className="p-3 text-xs rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400">
                        Profile updated.
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[10px] text-zinc-400 text-center px-1">No photo</span>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">Avatar</label>
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium cursor-pointer transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{data.avatar ? data.avatar.name : 'Choose Photo'}</span>
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        </label>
                        {errors.avatar && <p className="text-[11px] text-rose-500">{errors.avatar}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('full_name', 'Full Name')}
                    {field('professional_title', 'Professional Title')}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Bio (short, shown under name)</label>
                    <textarea
                        rows="2"
                        maxLength={500}
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-none"
                    />
                    {errors.bio && <p className="text-[11px] text-rose-500">{errors.bio}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">About Me (full paragraph)</label>
                    <textarea
                        rows="5"
                        value={data.about_me}
                        onChange={(e) => setData('about_me', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-none"
                    />
                    {errors.about_me && <p className="text-[11px] text-rose-500">{errors.about_me}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('email', 'Email', 'email')}
                    {field('phone', 'Phone')}
                    {field('github_url', 'GitHub URL')}
                    {field('linkedin_url', 'LinkedIn URL')}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">Resume (PDF)</label>
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium cursor-pointer transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{data.resume ? data.resume.name : 'Choose Resume'}</span>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setData('resume', e.target.files[0])}
                            className="hidden"
                        />
                    </label>
                    {errors.resume && <p className="text-[11px] text-rose-500">{errors.resume}</p>}
                    {profile.resume_path && (
                      <a  
                            href={profile.resume_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-4 block mt-1"
                        >
                            View current resume
                        </a>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-xs transition-all disabled:opacity-50"
                >
                    {processing ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </AdminLayout>
    );
}