import React, { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import Pagination from '../../Components/Shared/Pagination';

const STATUS_STYLES = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    failed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
};

const STAGE_LABELS = {
    otp_sent: 'OTP Sent',
    otp_verified: 'OTP Verified',
};

export default function LoginActivity({ attempts, filters }) {
    const { adminSlug } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimer = useRef(null);
    const isFirstRender = useRef(true);

    // Debounced server side search by IP or status, resets to page 1 each time.
    // Marked silent so AdminLayout's global overlay does not cover the table
    // while typing, the input's own spinner handles that feedback instead.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            router.get(`/${adminSlug}/dashboard/login-activity`, { search, page: 1 }, {
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
        <AdminLayout title="Login Activity" currentPath={`/${adminSlug}/dashboard/login-activity`}>
            <div className="mb-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {attempts.total} total login attempts, newest first.
                </p>
            </div>

            <div className="relative mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by IP address or status"
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