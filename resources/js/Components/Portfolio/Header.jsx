import React, { useRef } from 'react';

export default function Header({ name, hasCertificates, theme, toggleTheme, onSecretTrigger }) {
    const tapCount = useRef(0);
    const tapTimer = useRef(null);

    const handleNameTap = (e) => {
        scrollToSection(e, 'about', '/');

        tapCount.current += 1;

        if (tapTimer.current) clearTimeout(tapTimer.current);

        tapTimer.current = setTimeout(() => {
            tapCount.current = 0;
        }, 2000);

        if (tapCount.current >= 5) {
            tapCount.current = 0;
            onSecretTrigger();
        }
    };

    // Smooth scroll to section and update URL without full page reload
    const scrollToSection = (e, sectionId, path) => {
        e.preventDefault();
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState({}, '', path);
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between text-xs">
                <a href="/" onClick={handleNameTap} className="flex items-center gap-2.5 font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors select-none">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="font-semibold tracking-tight truncate max-w-[140px] sm:max-w-none">{name}</span>
                </a>

                <nav className="flex items-center gap-2 sm:gap-4 text-zinc-500 dark:text-zinc-400 font-medium">
                    <a href="/projects" onClick={(e) => scrollToSection(e, 'projects', '/projects')} className="hidden sm:inline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Projects</a>
                    <a href="/skills" onClick={(e) => scrollToSection(e, 'skills', '/skills')} className="hidden sm:inline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Skills</a>
                    <a href="/experience" onClick={(e) => scrollToSection(e, 'experience', '/experience')} className="hidden md:inline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Experience</a>
                    {hasCertificates && (
                        <a href="/certificates" onClick={(e) => scrollToSection(e, 'certificates', '/certificates')} className="hidden md:inline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Certs</a>
                    )}

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
                </nav>
            </div>
        </header>
    );
}