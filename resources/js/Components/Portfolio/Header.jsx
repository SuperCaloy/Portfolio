import React, { useRef, useState, useEffect } from 'react';

export default function Header({ name, hasCertificates, theme, toggleTheme, onSecretTrigger }) {
    const tapCount = useRef(0);
    const tapTimer = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

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
        const target = document.getElementById(sectionId);
        if (target) {
            if (window.lenis) {
                window.lenis.scrollTo(target, { offset: -60 });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
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
        const sectionIds = ['about', ...navLinks.map((link) => link.id), 'contact'];
        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        // We use a narrow trigger line 20% from the top of the viewport.
        // Whenever a section intersects this line, it becomes active.
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -79% 0px', threshold: 0 }
        );

        sections.forEach((section) => observer.observe(section));

        // Edge case: if the user scrolls to the absolute bottom of the page,
        // force the 'contact' section to be active, as short footers may not reach the 20% line.
        let ticking = false;
        const checkBottom = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
                setActiveSection('contact');
            }
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(checkBottom);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasCertificates]);

    return (
        <>
        {/* Mobile Menu Overlay */}
        <div 
            className={`fixed inset-0 z-40 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-3xl transition-all duration-700 ease-fluid flex flex-col items-center justify-center sm:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
            <nav className="flex flex-col items-center gap-4 text-2xl font-semibold tracking-tight">
                {navLinks.map((link, i) => (
                    <a
                        key={link.id}
                        href={link.path}
                        onClick={(e) => scrollToSection(e, link.id, link.path)}
                        className={`block px-8 py-3 rounded-full transition-all duration-500 ease-fluid delay-[${i * 100}ms] active:scale-95 active:duration-150 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} ${
                            activeSection === link.id
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 active:bg-zinc-100 dark:active:bg-zinc-800/50'
                        }`}
                    >
                        {link.label}
                    </a>
                ))}
                <a
                    href="/contact"
                    onClick={(e) => scrollToSection(e, 'contact', '/contact')}
                    className={`block px-8 py-3 rounded-full transition-all duration-500 ease-fluid delay-[${navLinks.length * 100}ms] active:scale-95 active:duration-150 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} ${
                        activeSection === 'contact'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 active:bg-zinc-100 dark:active:bg-zinc-800/50'
                    }`}
                >
                    Contact
                </a>
            </nav>
        </div>

        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto min-w-[320px] max-w-4xl backdrop-blur-xl bg-white/70 dark:bg-[#0a0a0a]/70 border border-zinc-200/50 dark:border-white/10 rounded-[2rem] shadow-ambient transition-all duration-700 ease-fluid">
            <div className="px-5 sm:px-6 h-14 flex items-center justify-between gap-6 sm:gap-12">
                <a href="/" onClick={handleNameTap} className="flex items-center gap-2.5 font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-500 transition-colors select-none shrink-0 min-w-0">
                    <div className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50 animate-ping [animation-duration:3s]"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="font-semibold tracking-tight text-base truncate max-w-[220px] sm:max-w-none">{name}</span>
                </a>

                <nav className="hidden sm:flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-medium text-[14px] shrink-0">
                    {navLinks.map((link) => (
                        <a
                            key={link.id}
                            href={link.path}
                            onClick={(e) => scrollToSection(e, link.id, link.path)}
                            className={`px-3 py-1.5 rounded-full transition-all duration-300 active:scale-95 ${
                                activeSection === link.id
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5'
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="/contact"
                        onClick={(e) => scrollToSection(e, 'contact', '/contact')}
                        className={`px-3 py-1.5 rounded-full transition-all duration-300 active:scale-95 ${
                            activeSection === 'contact'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5'
                        }`}
                    >
                        Contact
                    </a>
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
                        className="flex items-center justify-center min-w-[44px] min-h-[44px] -m-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 active:bg-zinc-100 dark:active:bg-zinc-900 transition-all"
                        title="Toggle theme"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="flex items-center justify-center min-w-[44px] min-h-[44px] -m-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 active:bg-zinc-100 dark:active:bg-zinc-900 transition-all"
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <div className="relative w-5 h-5 flex items-center justify-center">
                            <span className={`absolute h-0.5 w-5 bg-current rounded-full transition-transform duration-700 ease-fluid ${menuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
                            <span className={`absolute h-0.5 w-5 bg-current rounded-full transition-opacity duration-700 ease-fluid ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
                            <span className={`absolute h-0.5 w-5 bg-current rounded-full transition-transform duration-700 ease-fluid ${menuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
                        </div>
                    </button>
                </div>
            </div>
            
        </header>
        </>
    );
}