import React, { useEffect, useRef } from 'react';

export default function Atmosphere() {
    const progressRef = useRef(null);
    const spotlightRef = useRef(null);
    const rafProgressId = useRef(null);
    const rafSpotlightId = useRef(null);

    const targetPos = useRef({ x: 0, y: 0 });
    const currentPos = useRef({ x: 0, y: 0 });
    const isMoving = useRef(false);

    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

        // Progress Hairline scroll indicator
        const updateProgress = () => {
            if (!progressRef.current) return;
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollTotal > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollTotal)) : 0;
            progressRef.current.style.transform = `scaleX(${progress})`;
        };

        const handleScroll = () => {
            if (rafProgressId.current) cancelAnimationFrame(rafProgressId.current);
            rafProgressId.current = requestAnimationFrame(updateProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateProgress();

        // Initialize default centered coordinates
        const initialX = window.innerWidth / 2;
        const initialY = isTouch ? 320 : window.innerHeight / 2;
        targetPos.current = { x: initialX, y: initialY };
        currentPos.current = { x: initialX, y: initialY };

        if (spotlightRef.current) {
            spotlightRef.current.style.transform = `translate3d(${initialX}px, ${initialY}px, 0)`;
        }

        // Fluid Lerp easing loop for mouse spotlight
        const lerpFactor = 0.08;

        const animateSpotlight = () => {
            if (!spotlightRef.current) return;

            const dx = targetPos.current.x - currentPos.current.x;
            const dy = targetPos.current.y - currentPos.current.y;

            currentPos.current.x += dx * lerpFactor;
            currentPos.current.y += dy * lerpFactor;

            spotlightRef.current.style.transform = `translate3d(${currentPos.current.x.toFixed(2)}px, ${currentPos.current.y.toFixed(2)}px, 0)`;

            // Keep animating while distance is greater than 0.1px
            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                rafSpotlightId.current = requestAnimationFrame(animateSpotlight);
            } else {
                isMoving.current = false;
            }
        };

        // Pointer move handler with lerp wake-up (mouse only, ignoring coarse touch gestures)
        const handlePointerMove = (e) => {
            if (e.pointerType === 'touch') return;

            targetPos.current = { x: e.clientX, y: e.clientY };

            if (!isMoving.current) {
                isMoving.current = true;
                if (rafSpotlightId.current) cancelAnimationFrame(rafSpotlightId.current);
                rafSpotlightId.current = requestAnimationFrame(animateSpotlight);
            }
        };

        if (!reduceMotion && !isTouch) {
            window.addEventListener('pointermove', handlePointerMove, { passive: true });
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('pointermove', handlePointerMove);
            if (rafProgressId.current) cancelAnimationFrame(rafProgressId.current);
            if (rafSpotlightId.current) cancelAnimationFrame(rafSpotlightId.current);
        };
    }, []);

    return (
        <>
            {/* Scroll Progress Hairline */}
            <div
                id="progressLine"
                ref={progressRef}
                className="progress-line fixed top-0 left-0 right-0 h-[3px] z-[120] pointer-events-none origin-left scale-x-0 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]"
                aria-hidden="true"
            />

            {/* Ambient Dot Matrix Tech Grid */}
            <div
                id="ambientGrid"
                className="ambient-grid fixed inset-0 pointer-events-none z-0 opacity-30 dark:opacity-25"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
                    backgroundSize: '36px 36px',
                    maskImage: 'radial-gradient(ellipse at 50% 35%, black 40%, transparent 85%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at 50% 35%, black 40%, transparent 85%)',
                }}
                aria-hidden="true"
            />

            {/* Fluid Mouse-Following Gradient Spotlight Aura */}
            <div
                id="spotlight"
                ref={spotlightRef}
                className="spotlight pointer-events-none fixed top-0 left-0 w-[700px] h-[700px] -ml-[350px] -mt-[350px] rounded-full z-[1] opacity-50 dark:opacity-40 blur-[90px] transition-opacity duration-500 will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(5,150,105,0.12) 40%, rgba(6,78,59,0.05) 65%, transparent 80%)',
                }}
                aria-hidden="true"
            />

            {/* Ambient Fixed Top Glow */}
            <div
                className="glow-fixed fixed top-[-220px] left-1/2 -translate-x-1/2 w-[1100px] h-[550px] rounded-full pointer-events-none z-0 opacity-25 dark:opacity-20 blur-[130px]"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.25), rgba(6,78,59,0.08) 50%, transparent 75%)',
                }}
                aria-hidden="true"
            />
        </>
    );
}
