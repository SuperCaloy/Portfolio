import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import Pagination from '../../Components/Shared/Pagination';
import AdminSearchInput from '../../Components/Admin/AdminSearchInput';
import { useAdminSearch } from '../../hooks/useAdminSearch';
import { LOGIN_STATUS_STYLES as STATUS_STYLES, LOGIN_STAGE_LABELS as STAGE_LABELS } from '../../constants/admin';

export default function LoginActivity({ attempts, filters }) {
    const { adminSlug } = usePage().props;
    const { search, setSearch, isSearching } = useAdminSearch({
        route: `/${adminSlug}/dashboard/login-activity`,
        initialSearch: filters?.search || '',
        extraParams: { page: 1 },
    });

    return (
        <AdminLayout title="Login Activity" currentPath={`/${adminSlug}/dashboard/login-activity`}>
            <div className="mb-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {attempts.total} total login attempts, newest first.
                </p>
            </div>

            <AdminSearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by IP address or status"
                isSearching={isSearching}
            />

            <div className="overflow-x-auto rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-900/40 text-left text-zinc-500 dark:text-zinc-400">
                            <th className="px-4 py-2.5 font-medium">Time</th>
                            <th className="px-4 py-2.5 font-medium">Stage</th>
                            <th className="px-4 py-2.5 font-medium">Status</th>
                            <th className="px-4 py-2.5 font-medium">IP Address</th>
                            <th className="px-4 py-2.5 font-medium">Location</th>
                            <th className="px-4 py-2.5 font-medium">ISP</th>
                            <th className="px-4 py-2.5 font-medium">Device</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attempts.data.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
                                    {search ? 'No login attempts match your search.' : 'No login attempts recorded yet.'}
                                </td>
                            </tr>
                        )}

                        {attempts.data.map((attempt) => (
                            <tr
                                key={attempt.id}
                                className="border-t border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                            >
                                <td className="px-4 py-2.5 whitespace-nowrap font-mono text-sm">
                                    {new Date(attempt.created_at).toLocaleString()}
                                </td>
                                <td className="px-4 py-2.5">{STAGE_LABELS[attempt.stage] || attempt.stage}</td>
                                <td className="px-4 py-2.5">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[attempt.status] || ''}`}>
                                        {attempt.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 font-mono text-sm">{attempt.ip_address}</td>
                                <td className="px-4 py-2.5 text-sm">
                                    {[attempt.city, attempt.region, attempt.country].filter(Boolean).join(', ') || 'Unknown'}
                                </td>
                                <td className="px-4 py-2.5 text-sm">{attempt.isp || 'Unknown'}</td>
                                <td className="px-4 py-2.5 text-sm">
                                    {[attempt.browser, attempt.platform].filter(Boolean).join(' / ') || 'Unknown'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination links={attempts.links} />
        </AdminLayout>
    );
}