import React, { useState, useEffect } from 'react';

export default function Footer({ name, githubUrl, linkedinUrl }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            // Automatically formats to the user's local timezone
            setTime(now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="pt-24 pb-12 border-t border-zinc-200/60 dark:border-zinc-800/60">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
                
                {/* Left: Local Time */}
                <div className="flex flex-col items-start gap-4">
                    <span className="text-zinc-900 dark:text-zinc-100 font-semibold tracking-tight text-sm uppercase tracking-widest">Local Time</span>
                    <span className="font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/50 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800/50">
                        {time || '...'}
                    </span>
                </div>

                {/* Right: Links */}
                <div className="flex flex-col items-start md:items-end gap-4">
                    <span className="text-zinc-900 dark:text-zinc-100 font-semibold tracking-tight text-sm uppercase tracking-widest">Connect</span>
                    <div className="flex items-center gap-3">
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="p-3 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 active:scale-95 transition-all duration-300 ring-1 ring-zinc-200/50 dark:ring-white/10"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.017c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.082-.729.082-.729 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.808 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.303-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.241 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.624-5.475 5.92.43.372.823 1.102.823 2.222v3.293c0 .32.192.694.8.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                            </a>
                        )}
                        {linkedinUrl && (
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="p-3 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 active:scale-95 transition-all duration-300 ring-1 ring-zinc-200/50 dark:ring-white/10"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>

            </div>
            
        </footer>
    );
}