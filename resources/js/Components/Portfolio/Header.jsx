import React, { useRef, useState, useEffect } from 'react';
import ContactModal from './ContactModal';

export default function Header({ name, hasCertificates, theme, toggleTheme, onSecretTrigger }) {
    const tapCount = useRef(0);
    const tapTimer = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

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

    const scrollToSection = (e, sectionId, path) => {
        e.preventDefault();
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState({}, '', path);
        setMenuOpen(false);
    };

    const navLinks = [
        { id: 'projects', path: '/projects', label: 'Projects' },
        { id: 'tech', path: '/tech', label: 'Tech' },
        { id: 'experience', path: '/experience', label: 'Experience' },
        ...(hasCertificates ? [{ id: 'certificates', path: '/certificates', label: 'Certificate' }] : []),
    ];

    const [activeSection, setActiveSection] = useState('about');
    
    const [scrollProgress, setScrollProgress] = useState(0);
    
    useEffect(() => {
        let ticking = false;

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setScrollProgress(progress);
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateProgress();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    // First and last word only, used on narrow screens so the full name
    // doesn't get cut off or crowd the nav.
    const nameParts = (name || '').trim().split(/\s+/).filter(Boolean);
    const shortName = nameParts.length > 1
        ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
        : name;

    // Tracks which section is currently most visible while scrolling,
    // used to highlight the matching nav link.
    useEffect(() => {
        const sectionIds = ['about', ...navLinks.map((link) => link.id)];
        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]) {
                    setActiveSection(visible[0].target.id);
                }
            },
            { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [hasCertificates]);

    const openContact = () => {
        setIsContactOpen(true);
        setMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/60 dark:border-zinc-800/60 transition-colors duration-200 [transform:translateZ(0)] [will-change:backdrop-filter]">
            <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <a href="/" onClick={handleNameTap} className="flex items-center gap-2.5 font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white active:opacity-60 transition-colors select-none min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="sm:hidden font-semibold tracking-tight text-base truncate max-w-[180px]">{shortName}</span>
                    <span className="hidden sm:inline font-semibold tracking-tight text-base truncate">{name}</span>
                </a>

                <nav className="hidden sm:flex items-center gap-5 text-zinc-500 dark:text-zinc-400 font-medium text-[15px] shrink-0">
                    {navLinks.map((link) => (
                        <a
                            key={link.id}
                            href={link.path}
                            onClick={(e) => scrollToSection(e, link.id, link.path)}
                            className={`transition-colors active:opacity-60 ${
                                activeSection === link.id
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'hover:text-emerald-600 dark:hover:text-emerald-400'
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                    <button
                        onClick={openContact}
                        className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 active:opacity-60"
                    >
                        Contact
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 active:scale-90 transition-all"
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

                {/* Mobile controls use larger 44px+ touch targets, desktop uses mouse-sized ones */}
                <div className="flex sm:hidden items-center gap-1 shrink-0">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 -m-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 active:bg-zinc-100 dark:active:bg-zinc-900 transition-all"
                        title="Toggle theme"
                        aria-label="Toggle theme"
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
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="p-2.5 -m-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 active:bg-zinc-100 dark:active:bg-zinc-900 transition-all"
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            <div className="h-0.5 bg-zinc-200/60 dark:bg-zinc-800/60">
                <div
                    className="h-full bg-emerald-500 transition-[width] duration-150 ease-fluid"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>
            {menuOpen && (
                <>
                    <style>{`
                        @keyframes headerMenuIn {
                            from { opacity: 0; transform: translateY(-6px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                    <nav
                        className="sm:hidden border-t border-zinc-200/60 dark:border-zinc-800/60 px-2 py-2 flex flex-col text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 shadow-soft animate-[headerMenuIn_0.15s_ease-out]"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.path}
                                onClick={(e) => scrollToSection(e, link.id, link.path)}
                                className={`px-3 py-3 rounded-lg transition-colors active:bg-zinc-100 dark:active:bg-zinc-900 ${
                                    activeSection === link.id
                                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                                        : 'hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                        <button
                            onClick={openContact}
                            className="text-left px-3 py-3 rounded-lg transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 active:bg-zinc-100 dark:active:bg-zinc-900"
                        >
                            Contact
                        </button>
                    </nav>
                </>
            )}

            <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </header>
    );
}