import React, { useRef, useState, useEffect, useCallback } from 'react';

export default function Header({ name, onSecretTrigger }) {
    const tapCount = useRef(0);
    const tapTimer = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [hoveredSection, setHoveredSection] = useState(null);

    const mobileNavRef = useRef(null);

    // Manage mobile menu open state: lock scroll, shift focus, trap Tab, and handle Escape
    useEffect(() => {
        if (!menuOpen) return;

        document.body.style.overflow = 'hidden';
        window.lenis?.stop();

        // Shift focus to the first mobile nav link
        const timer = setTimeout(() => {
            const firstLink = mobileNavRef.current?.querySelector('a');
            firstLink?.focus();
        }, 50);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                const btn = document.getElementById('mobileMenuBtn');
                if (btn) btn.focus();
                return;
            }
            if (e.key === 'Tab' && mobileNavRef.current) {
                const links = mobileNavRef.current.querySelectorAll('a');
                if (links.length === 0) return;
                const first = links[0];
                const last = links[links.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            window.lenis?.start();
        };
    }, [menuOpen]);

    const navLinksRef = useRef(null);
    const linkRefs = useRef({});
    const [pillStyle, setPillStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

    const handleNameTap = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setActiveSection(null);
        if (window.lenis) {
            window.lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.history.pushState({}, '', '/');
        setMenuOpen(false);

        tapCount.current += 1;
        if (tapTimer.current) clearTimeout(tapTimer.current);
        tapTimer.current = setTimeout(() => {
            tapCount.current = 0;
        }, 2000);
        if (tapCount.current >= 5) {
            tapCount.current = 0;
            if (onSecretTrigger) onSecretTrigger();
        }
    };

    const scrollToSection = (e, sectionId, path) => {
        if (e && e.preventDefault) e.preventDefault();
        setActiveSection(sectionId);
        const target =
            document.getElementById(sectionId) ||
            (sectionId === 'projects' ? document.getElementById('featured-works') : null) ||
            (sectionId === 'certificates' ? document.getElementById('certificate') : null);

        if (target) {
            if (window.lenis) {
                window.lenis.scrollTo(target, { offset: -30 });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
        if (path) {
            window.history.pushState({}, '', path);
        }
        setMenuOpen(false);
    };

    // Primary navigation sections matching exact portfolio hierarchy
    const navLinks = [
        { id: 'projects', path: '#projects', label: 'Projects', targetIds: ['projects', 'featured-works'] },
        { id: 'tech', path: '#tech', label: 'Tech', targetIds: ['tech'] },
        { id: 'experience', path: '#experience', label: 'Experience', targetIds: ['experience'] },
        { id: 'certificates', path: '#certificates', label: 'Certifications', targetIds: ['certificates', 'certificate'] },
        { id: 'contact', path: '#contact', label: 'Contact', targetIds: ['contact'] },
    ];

    const currentTargetId = hoveredSection || activeSection;
    const isHoveringNonActive = hoveredSection && hoveredSection !== activeSection;

    // Smoothly calculate sliding pill position using exact offset geometries
    const updatePill = useCallback(() => {
        const activeEl = currentTargetId ? linkRefs.current[currentTargetId] : null;
        const containerEl = navLinksRef.current;
        if (activeEl && containerEl) {
            setPillStyle({
                left: activeEl.offsetLeft,
                top: activeEl.offsetTop,
                width: activeEl.offsetWidth,
                height: activeEl.offsetHeight,
                opacity: 1,
            });
        } else {
            setPillStyle((prev) => ({ ...prev, opacity: 0 }));
        }
    }, [currentTargetId]);

    useEffect(() => {
        updatePill();
        const timer = setTimeout(updatePill, 60);
        window.addEventListener('resize', updatePill);
        if (typeof document !== 'undefined' && document.fonts) {
            document.fonts.ready.then(updatePill);
        }
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePill);
        };
    }, [updatePill]);

    // Accurate scroll spy: track active section with scroll positions
    useEffect(() => {
        const handleScroll = () => {
            // Near document bottom, activate 'contact'
            const scrollBottom = window.innerHeight + window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            if (scrollBottom >= docHeight - 90) {
                setActiveSection('contact');
                return;
            }

            // At top of page, no sub-section pill is active
            if (window.scrollY < 220) {
                setActiveSection(null);
                return;
            }

            const trigger = Math.min(240, window.innerHeight * 0.35);
            for (const link of navLinks) {
                for (const targetId of link.targetIds) {
                    const el = document.getElementById(targetId);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        if (rect.top <= trigger && rect.bottom > trigger) {
                            setActiveSection(link.id);
                            return;
                        }
                    }
                }
            }
        };

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        handleScroll();

        // Check hash on load
        if (window.location.hash) {
            const hashId = window.location.hash.replace('#', '');
            const matched = navLinks.find(
                (l) => l.id === hashId || l.targetIds.includes(hashId)
            );
            if (matched) {
                setActiveSection(matched.id);
            }
        }

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            {/* Mobile Fullscreen Overlay */}
            <div
                ref={mobileNavRef}
                id="mobileNav"
                aria-hidden={!menuOpen}
                inert={!menuOpen ? true : undefined}
                className={`fixed inset-0 z-[95] bg-[#09090B]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 md:hidden ${
                    menuOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
                }`}
                style={{
                    paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
                    paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
                }}
            >
                {navLinks.map((link) => (
                    <a
                        key={link.id}
                        href={link.path}
                        onClick={(e) => scrollToSection(e, link.id, link.path)}
                        aria-current={activeSection === link.id ? 'page' : undefined}
                        className={`text-xl font-sans font-semibold tracking-wide px-6 py-3 min-h-[44px] flex items-center justify-center rounded-full transition-all duration-200 select-none ${
                            activeSection === link.id
                                ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95'
                        }`}
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            {/* Dynamic Floating Header */}
            <header
                className="fixed top-4 sm:top-5 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
                style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
            >
                <nav
                    className="header-nav pointer-events-auto px-4 sm:px-6 py-2 sm:py-2.5 flex justify-between items-center gap-4 max-w-4xl w-full bg-[#121216]/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.7)] transition-all duration-300"
                    aria-label="Primary"
                >
                    <a
                        href="#top"
                        onClick={handleNameTap}
                        className="brand-link text-xs sm:text-sm font-bold tracking-wider uppercase text-white flex items-center gap-2 sm:gap-2.5 no-underline shrink-0 select-none group min-h-[44px]"
                    >
                        <span className="dot-brand w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981] inline-block animate-[live-pulse_2s_infinite_ease-in-out]" />
                        <span className="group-hover:text-emerald-400 transition-colors font-mono tracking-tight font-bold">{name}</span>
                    </a>

                    {/* Desktop Nav Links Container with Fluid Sliding Pill */}
                    <div
                        ref={navLinksRef}
                        onMouseLeave={() => setHoveredSection(null)}
                        className="relative hidden md:flex items-center gap-0.5 sm:gap-1 p-1 bg-white/[0.03] rounded-full border border-white/5"
                    >
                        {/* Smoothly Sliding Indicator Pill */}
                        <span
                            className={`absolute top-0 left-0 rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                                isHoveringNonActive
                                    ? 'bg-white/[0.08] border border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm'
                                    : 'bg-emerald-500/15 border border-emerald-500/35 shadow-[0_0_16px_rgba(16,185,129,0.22)]'
                            }`}
                            style={{
                                transform: `translate3d(${pillStyle.left}px, ${pillStyle.top}px, 0)`,
                                width: `${pillStyle.width}px`,
                                height: `${pillStyle.height}px`,
                                opacity: pillStyle.opacity,
                            }}
                        />

                        {navLinks.map((link) => {
                            const isActive = activeSection === link.id;
                            const isHovered = hoveredSection === link.id;

                            let textColor = 'text-zinc-400';
                            if (isActive) {
                                textColor = 'text-emerald-300 font-semibold';
                            } else if (isHovered) {
                                textColor = 'text-white font-medium';
                            }

                            return (
                                <a
                                    key={link.id}
                                    ref={(el) => (linkRefs.current[link.id] = el)}
                                    href={link.path}
                                    onClick={(e) => scrollToSection(e, link.id, link.path)}
                                    onMouseEnter={() => setHoveredSection(link.id)}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`relative z-10 text-xs sm:text-[13px] font-sans px-3.5 py-2 min-h-[44px] rounded-full whitespace-nowrap transition-colors duration-200 select-none no-underline flex items-center justify-center ${textColor}`}
                                >
                                    {link.label}
                                </a>
                            );
                        })}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex md:hidden items-center shrink-0">
                        <button
                            id="mobileMenuBtn"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="p-2 min-w-[44px] min-h-[44px] flex flex-col justify-center items-center gap-1 text-white active:scale-90 transition-all cursor-pointer"
                            aria-label="Toggle navigation menu"
                            aria-expanded={menuOpen}
                            aria-controls="mobileNav"
                        >
                            <span className={`w-5 h-0.5 bg-white rounded-full transition-transform duration-300 ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
                            <span className={`w-5 h-0.5 bg-white rounded-full transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-5 h-0.5 bg-white rounded-full transition-transform duration-300 ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
                        </button>
                    </div>
                </nav>
            </header>
        </>
    );
}