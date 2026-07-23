import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '../../Components/Admin/AdminLayout';
const STATS = [
    { label: 'Total Projects', value: '00' },
    { label: 'Published', value: '00' },
    { label: 'Draft', value: '00' },
    { label: 'Unread Messages', value: '00' },
];

export default function Dashboard() {
    const { url } = usePage();

    return (
        <AdminLayout title="Dashboard" currentPath={url}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map((stat) => (
                    <div
                        key={stat.label}
                        className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80"
                    >
                        <p className="text-2xl font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                            {stat.value}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono uppercase tracking-wide">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Real dashboard modules will replace this section once each is built.
                </p>
            </div>
        </AdminLayout>
    );
}