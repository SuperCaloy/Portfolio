import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import useTheme from '../../hooks/useTheme';
import ConfirmModal from '../Shared/ConfirmModal';

export default function AdminLayout({ title, currentPath, children }) {
    const { adminSlug } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [confirmingLogout, setConfirmingLogout] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const [navigating, setNavigating] = useState(false);
    const [navLabel, setNavLabel] = useState('Loading...');

    useEffect(() => {
        // Picks a label based on the HTTP method of the request, so delete,
        // save, and plain navigation all show a message that matches what
        // is actually happening instead of one generic "Loading..." text.
        const removeStart = router.on('start', (event) => {
            const method = event.detail.visit.method;
            if (method === 'delete') {
                setNavLabel('Deleting...');
            } else if (method === 'put' || method === 'patch' || method === 'post') {
                setNavLabel('Saving...');
            } else {
                setNavLabel('Loading...');
            }
            setNavigating(true);
        });
        const removeFinish = router.on('finish', () => setNavigating(false));
        return () => {
            removeStart();
            removeFinish();
        };
    }, []);
    const { theme, toggleTheme } = useTheme();

    const NAV_ITEMS = [
        { label: 'Dashboard', href: `/${adminSlug}/dashboard` },
        { label: 'Profile', href: `/${adminSlug}/dashboard/profile` },
        { label: 'Skills', href: `/${adminSlug}/dashboard/skills` },
        { label: 'Projects', href: `/${adminSlug}/dashboard/projects` },
        { label: 'Experience', href: `/${adminSlug}/dashboard/experience` },
        { label: 'Certificates', href: `/${adminSlug}/dashboard/certificates` },
        { label: 'Messages', href: `/${adminSlug}/dashboard/messages` },
        { label: 'Activity Log', href: `/${adminSlug}/dashboard/login-activity` },
    ];

    const handleLogout = () => {
        setLoggingOut(true);
        router.post(`/${adminSlug}/logout`, {}, {
            onError: () => setLoggingOut(false),
        });
    };

    const segments = currentPath
        .replace(`/${adminSlug}/dashboard`, '')
        .split('/')
        .filter(Boolean);
    const breadcrumb = segments.length ? segments.join(' / ') : 'overview';

    return (
        <div className="min-h-screen flex bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200/60 dark:border-zinc-800/60 flex flex-col transition-transform duration-200 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="px-5 h-16 flex items-center gap-2.5 border-b border-zinc-200/60 dark:border-zinc-800/60">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">Admin Panel</span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = currentPath === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`block px-3 py-2 rounded-lg text-xs font-medium font-mono transition-all ${
                                    isActive
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <button
                        type="button"
                        onClick={() => setConfirmingLogout(true)}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-xs font-mono font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-60"
                    >
                        {loggingOut && (
                            <span className="w-3 h-3 rounded-full border-2 border-rose-300 dark:border-rose-800 border-t-rose-600 dark:border-t-rose-400 animate-spin shrink-0" />
                        )}
                        {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 h-16 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/60 dark:border-zinc-800/60">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                            aria-label="Open menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
                            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600">
                                dashboard / {breadcrumb}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>session active</span>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            title="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </header>

                <main className="flex-1 px-4 md:px-8 py-6">{children}</main>
            </div>

            {confirmingLogout && !loggingOut && (
                <ConfirmModal
                    title="Log out?"
                    message="You will need to sign in again to access the admin dashboard."
                    danger
                    onConfirm={handleLogout}
                    onCancel={() => setConfirmingLogout(false)}
                />
            )}

            {loggingOut && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 px-8 py-6 shadow-xl">
                        <span className="w-8 h-8 rounded-full border-2 border-zinc-200 dark:border-zinc-800 border-t-rose-500 animate-spin" />
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Logging out...</p>
                    </div>
                </div>
            )}
            {navigating && !loggingOut && (
                // z-[200] keeps this above any open modal or confirm dialog
                // (both use z-[100]), so it stays visible instead of being
                // covered while a modal is still open during save/delete.
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 px-8 py-6 shadow-xl">
                        <span className="w-8 h-8 rounded-full border-2 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 animate-spin" />
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{navLabel}</p>
                    </div>
                </div>
            )}
        </div>
    );
}