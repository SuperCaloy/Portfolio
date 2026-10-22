import React, { useState, useEffect } from 'react';
import { GithubIcon, LinkedinIcon } from '../Shared/SocialIcons';

export default function Footer({ name = 'Ramon Pacilona', githubUrl, linkedinUrl }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer
            className="footbar pt-20 pb-12 border-t border-white/10 max-w-6xl mx-auto px-4 sm:px-6 w-full text-xs font-mono text-zinc-400"
            style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom, 0px))' }}
        >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
                {/* Local Time Display (Clean Monospace) */}
                <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-zinc-500">LOCAL TIME:</span>
                    <span className="text-emerald-400 font-semibold">{time || '...'}</span>
                </div>

                {/* Social Links with 44px Tap Target Floor */}
                <div className="soc flex items-center flex-wrap gap-3">
                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Profile"
                            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] min-w-[44px] rounded-full bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all hover:-translate-y-0.5"
                        >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span className="font-mono text-xs uppercase tracking-wider">GitHub</span>
                        </a>
                    )}
                    {linkedinUrl && (
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn Profile"
                            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] min-w-[44px] rounded-full bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all hover:-translate-y-0.5"
                        >
                            <LinkedinIcon className="w-3.5 h-3.5" />
                            <span className="font-mono text-xs uppercase tracking-wider">LinkedIn</span>
                        </a>
                    )}
                </div>
            </div>

            <div className="pt-6 pb-12 sm:pb-0 pr-16 sm:pr-0 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-zinc-500 text-[11px]">
                <span>&copy; {new Date().getFullYear()} {name}. All rights reserved.</span>
            </div>
        </footer>
    );
}