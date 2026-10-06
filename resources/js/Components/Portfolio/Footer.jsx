import React, { useState, useEffect } from 'react';
import { GithubIcon, LinkedinIcon } from '../Shared/SocialIcons';

export default function Footer({ githubUrl, linkedinUrl }) {
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
                                <GithubIcon className="w-5 h-5" />
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
                                <LinkedinIcon className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>

            </div>
            
        </footer>
    );
}