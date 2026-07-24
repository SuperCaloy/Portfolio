import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import AdminLayout from '../../Components/Admin/AdminLayout';

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    const days = Math.floor(seconds / 86400);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
}

function QuickAction({ label, href }) {
    return (
        <Link
            href={href}
            className="px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-all"
        >
            {label}
        </Link>
    );
}

function RecentActivityCard({ label, title, subtitle, date, href, image }) {
    if (!title) {
        return (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
                <p className="text-xs font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
                    {label}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">None added yet.</p>
            </div>
        );
    }

    return (
        <Link
            href={href}
            className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
            {image ? (
                <img src={image} alt={title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
            ) : (
                <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
                <p className="text-xs font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">
                    {label}
                </p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{title}</p>
                {subtitle && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{subtitle}</p>
                )}
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">{timeAgo(date)}</span>
        </Link>
    );
}

export default function Dashboard({ stats, recentMessages, recentProject, recentExperience, recentCertificate }) {
    const { url, props } = usePage();
    const { adminSlug } = props;

    return (
        <AdminLayout title="Dashboard" currentPath={url}>
            <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Unread Messages
                    </p>
                    <p className="text-2xl font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {stats.unread_messages}
                    </p>
                </div>

                {recentMessages.length === 0 ? (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">No messages yet.</p>
                ) : (
                    <div className="space-y-2">
                        {recentMessages.map((message) => (
                            <Link
                                key={message.id}
                                href={`/${adminSlug}/dashboard/messages`}
                                className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                            >
                                {!message.is_read && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                        {message.subject || 'No subject'}
                                    </p>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                                        {message.sender_name}
                                    </p>
                                </div>
                                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">
                                    {formatDate(message.created_at)}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
                    <p className="text-2xl font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {stats.projects}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono uppercase tracking-wide">
                        Total Projects
                    </p>
                </div>

                <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
                    <p className="text-2xl font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {stats.experience}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono uppercase tracking-wide">
                        Experience Entries
                    </p>
                </div>

                <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
                    <p className="text-2xl font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {stats.certificates}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono uppercase tracking-wide">
                        Certificates
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-xs font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-3">
                    Recently Added
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RecentActivityCard
                        label="Project"
                        title={recentProject?.title}
                        date={recentProject?.created_at}
                        image={recentProject?.image_path}
                        href={`/${adminSlug}/dashboard/projects`}
                    />
                    <RecentActivityCard
                        label="Experience"
                        title={recentExperience?.role}
                        subtitle={recentExperience?.company}
                        date={recentExperience?.created_at}
                        href={`/${adminSlug}/dashboard/experience`}
                    />
                    <RecentActivityCard
                        label="Certificate"
                        title={recentCertificate?.title}
                        subtitle={recentCertificate?.issuer}
                        date={recentCertificate?.created_at}
                        href={`/${adminSlug}/dashboard/certificates`}
                    />
                </div>
            </div>

            <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
                <p className="text-xs font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-3">
                    Quick Actions
                </p>
                <div className="flex flex-wrap gap-2">
                    <QuickAction label="Add Project" href={`/${adminSlug}/dashboard/projects`} />
                    <QuickAction label="Add Experience" href={`/${adminSlug}/dashboard/experience`} />
                    <QuickAction label="Add Certificate" href={`/${adminSlug}/dashboard/certificates`} />
                    <QuickAction label="View Messages" href={`/${adminSlug}/dashboard/messages`} />
                </div>
            </div>
        </AdminLayout>
    );
}