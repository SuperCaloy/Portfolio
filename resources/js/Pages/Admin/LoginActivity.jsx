import React from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';

const STATUS_STYLES = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    failed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
};

const STAGE_LABELS = {
    otp_sent: 'OTP Sent',
    otp_verified: 'OTP Verified',
};

export default function LoginActivity({ attempts }) {
    return (
        <AdminLayout title="Login Activity" currentPath="/login-activity">
            <div className="mb-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Most recent 200 login attempts, newest first.
                </p>
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
                        {attempts.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
                                    No login attempts recorded yet.
                                </td>
                            </tr>
                        )}

                        {attempts.map((attempt) => (
                            <tr
                                key={attempt.id}
                                className="border-t border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                            >
                                <td className="px-4 py-2.5 whitespace-nowrap font-mono text-xs">
                                    {new Date(attempt.created_at).toLocaleString()}
                                </td>
                                <td className="px-4 py-2.5">{STAGE_LABELS[attempt.stage] || attempt.stage}</td>
                                <td className="px-4 py-2.5">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[attempt.status] || ''}`}>
                                        {attempt.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 font-mono text-xs">{attempt.ip_address}</td>
                                <td className="px-4 py-2.5 text-xs">
                                    {[attempt.city, attempt.region, attempt.country].filter(Boolean).join(', ') || 'Unknown'}
                                </td>
                                <td className="px-4 py-2.5 text-xs">{attempt.isp || 'Unknown'}</td>
                                <td className="px-4 py-2.5 text-xs">
                                    {[attempt.browser, attempt.platform].filter(Boolean).join(' / ') || 'Unknown'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}