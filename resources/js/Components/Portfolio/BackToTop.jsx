import React, { useState, useEffect, useCallback, useRef } from 'react';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // Check if user has reached the bottom or last section of the page
            const isAtBottom = windowHeight + currentScrollY >= docHeight - 220;

            // Near the top of the page (hero and initial view), always hide
            const isNearTop = currentScrollY < 400;

            // Check if user is scrolling up after having scrolled past the hero and reel sections
            const isScrollingUp = currentScrollY < lastScrollY.current && currentScrollY > 400;

            if (isNearTop) {
                setIsVisible(false);
            } else if (isAtBottom || isScrollingUp) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = useCallback(() => {
        if (window.lenis) {
            window.lenis.scrollTo(0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, []);

    return (
        <div
            id="floatingBackToTop"
            className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ease-out back-to-top ${
                isVisible
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            style={{
                bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
                right: 'calc(1.5rem + env(safe-area-inset-right, 0px))',
            }}
        >
            <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                title="Back to top"
                className="group relative flex items-center justify-center gap-2 p-1.5 min-w-[44px] min-h-[44px] rounded-full bg-[#0C0C0E]/90 backdrop-blur-md border border-white/15 hover:border-emerald-500/50 shadow-[0_8px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300 cursor-pointer active:scale-95"
            >
                <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 group-hover:bg-emerald-500/10 transition-all">
                    <svg
                        className="w-4 h-4 transform group-hover:-translate-y-0.5 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </div>
                <span className="hidden sm:inline-block pr-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors select-none">
                    Top
                </span>
            </button>
        </div>
    );
}
