import React, { useMemo, useRef, useEffect } from 'react';
import { optimizeCloudinaryUrl } from '../../utils/image';

function ReelRow({ id = 'marqueeTrack', baseSpeed = -70, projects, onSelectProject }) {
    const trackRef = useRef(null);
    const setRef = useRef(null);
    const posRef = useRef(0);
    const velocityRef = useRef(0);
    const isDraggingRef = useRef(false);
    const isHoveredRef = useRef(false);
    const isFocusedRef = useRef(false);
    const pointerIdRef = useRef(null);
    const startXRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const dragDistanceRef = useRef(0);
    const hasDraggedRef = useRef(false);
    const strideRef = useRef(3500);
    const animFrameRef = useRef(null);
    const lastFrameTimeRef = useRef(0);
    const ignoreClickUntilRef = useRef(0);

    // Measure stride dynamically from the rendered card set
    useEffect(() => {
        const updateStride = () => {
            if (setRef.current) {
                const w = setRef.current.offsetWidth;
                if (w > 0) strideRef.current = w;
            }
        };
        updateStride();
        const timer = setTimeout(updateStride, 400);
        window.addEventListener('resize', updateStride);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateStride);
        };
    }, [projects]);

    // rAF momentum physics and continuous auto-glide loop with viewport intersection observer
    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const cruiseSpeed = reduceMotion ? 0 : baseSpeed;
        let isVisible = true;

        const loop = (now) => {
            if (!isVisible) {
                lastFrameTimeRef.current = null;
                return;
            }

            if (!lastFrameTimeRef.current) lastFrameTimeRef.current = now;
            const dt = Math.min((now - lastFrameTimeRef.current) / 1000, 0.1);
            lastFrameTimeRef.current = now;

            if (isDraggingRef.current) {
                // Position is updated in real time via pointermove
            } else {
                if (Math.abs(velocityRef.current) > 5) {
                    posRef.current += velocityRef.current * dt;
                    // Exponential friction decay for flick gestures
                    velocityRef.current *= Math.pow(0.005, dt);
                } else {
                    velocityRef.current = 0;
                    if (!isHoveredRef.current && !isFocusedRef.current) {
                        posRef.current += cruiseSpeed * dt;
                    }
                }
            }

            // Normalization: wrap seamlessly between -stride and 0
            const stride = strideRef.current || 3500;
            let norm = posRef.current % stride;
            if (norm > 0) norm -= stride;

            if (trackRef.current) {
                trackRef.current.style.transform = `translate3d(${norm.toFixed(2)}px, 0, 0)`;
            }

            animFrameRef.current = requestAnimationFrame(loop);
        };

        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = requestAnimationFrame(loop);
            }
        }, { threshold: 0 });

        if (trackRef.current) {
            observer.observe(trackRef.current);
        }

        animFrameRef.current = requestAnimationFrame(loop);
        return () => {
            observer.disconnect();
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [baseSpeed]);

    // Global pointer move and up handlers to guarantee smooth drag tracking across entire window
    useEffect(() => {
        const onWindowPointerMove = (e) => {
            if (!isDraggingRef.current || pointerIdRef.current !== e.pointerId) return;
            const currentX = e.clientX;
            const deltaX = currentX - lastXRef.current;
            const now = performance.now();
            const dt = Math.max(1, now - lastTimeRef.current) / 1000;

            posRef.current += deltaX;
            dragDistanceRef.current += Math.abs(deltaX);

            if (dragDistanceRef.current > 6) {
                hasDraggedRef.current = true;
            }

            const instantV = deltaX / dt;
            velocityRef.current = velocityRef.current * 0.4 + instantV * 0.6;

            lastXRef.current = currentX;
            lastTimeRef.current = now;

            // Direct transform update for 0ms input latency
            const stride = strideRef.current || 3500;
            let norm = posRef.current % stride;
            if (norm > 0) norm -= stride;
            if (trackRef.current) {
                trackRef.current.style.transform = `translate3d(${norm.toFixed(2)}px, 0, 0)`;
            }
        };

        const onWindowPointerUp = (e) => {
            if (!isDraggingRef.current || pointerIdRef.current !== e.pointerId) return;
            isDraggingRef.current = false;
            pointerIdRef.current = null;

            if (trackRef.current) {
                trackRef.current.classList.remove('is-dragging');
            }

            if (hasDraggedRef.current) {
                // Suppress accidental card click immediately after a drag gesture
                ignoreClickUntilRef.current = performance.now() + 150;
            }
        };

        window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
        window.addEventListener('pointerup', onWindowPointerUp);
        window.addEventListener('pointercancel', onWindowPointerUp);

        return () => {
            window.removeEventListener('pointermove', onWindowPointerMove);
            window.removeEventListener('pointerup', onWindowPointerUp);
            window.removeEventListener('pointercancel', onWindowPointerUp);
        };
    }, []);

    // Pointer down handler on the row track
    const handlePointerDown = (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        pointerIdRef.current = e.pointerId;
        startXRef.current = e.clientX;
        lastXRef.current = e.clientX;
        lastTimeRef.current = performance.now();
        dragDistanceRef.current = 0;
        velocityRef.current = 0;

        if (trackRef.current) {
            trackRef.current.classList.add('is-dragging');
        }
    };

    const renderCard = (project, uniqueKey, isDuplicate = false) => (
        <div
            key={uniqueKey}
            className="reel-card relative rounded-2xl overflow-hidden bg-[#121214] border border-white/10 hover:border-emerald-500/80 shadow-md hover:shadow-[0_12px_36px_-6px_rgba(16,185,129,0.3)] hover:scale-[1.03] hover:z-30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 w-[310px] sm:w-[390px] md:w-[460px] h-[195px] sm:h-[245px] md:h-[275px] cursor-pointer group select-none"
            onClick={() => {
                if (performance.now() < ignoreClickUntilRef.current) return;
                if (onSelectProject) onSelectProject(project);
            }}
            onMouseEnter={() => {
                if (!isDraggingRef.current) isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
                isHoveredRef.current = false;
            }}
            onFocus={() => {
                isFocusedRef.current = true;
            }}
            onBlur={() => {
                isFocusedRef.current = false;
            }}
            onTouchStart={() => {
                isHoveredRef.current = true;
            }}
            onTouchEnd={() => {
                isHoveredRef.current = false;
            }}
            role={isDuplicate ? undefined : "button"}
            tabIndex={isDuplicate ? -1 : 0}
            aria-hidden={isDuplicate ? "true" : undefined}
            aria-label={isDuplicate ? undefined : `View specifications for ${project.title}`}
            onKeyDown={isDuplicate ? undefined : (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onSelectProject) onSelectProject(project);
                }
            }}
        >
            {/* Screenshot preview */}
            <img
                src={optimizeCloudinaryUrl(project.image_path, 800)}
                alt={project.title}
                className="w-full h-full object-cover filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ease-out pointer-events-none"
                loading="lazy"
                decoding="async"
                draggable={false}
            />

            {/* Readability Scrim and Database Metadata Overlay */}
            <div className="reel-scrim reel-meta-overlay absolute inset-x-0 bottom-0 pt-16 pb-4 px-4 sm:px-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col justify-end pointer-events-none z-10 transition-all duration-300">
                <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        {project.subtitle ? (
                            <span className="reel-card-subtitle font-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 mb-1.5 inline-block w-max max-w-full truncate">
                                {project.subtitle}
                            </span>
                        ) : null}
                        <h4 className="reel-card-title text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-emerald-300 transition-colors drop-shadow-sm leading-snug">
                            {project.title}
                        </h4>
                    </div>

                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 border border-white/20 group-hover:border-emerald-400 group-hover:bg-emerald-500/20 flex items-center justify-center shrink-0 text-white/70 group-hover:text-emerald-300 transition-all duration-300 mb-0.5">
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="marquee-track-wrap overflow-hidden w-full py-5 -my-5 flex select-none relative">
            <div
                ref={trackRef}
                id={id}
                className="marquee-track flex shrink-0 select-none will-change-transform cursor-grab active:cursor-grabbing touch-pan-y"
                onPointerDown={handlePointerDown}
            >
                <div ref={setRef} className="flex gap-5 shrink-0 pr-5">
                    {(() => {
                        const seenIds = new Set();
                        return projects.map((project, idx) => {
                            const isDup = seenIds.has(project.id);
                            seenIds.add(project.id);
                            return renderCard(project, `${id}-1-${project.id || idx}-${idx}`, isDup);
                        });
                    })()}
                </div>
                <div aria-hidden="true" className="flex gap-5 shrink-0 pr-5">
                    {projects.map((project, idx) =>
                        renderCard(project, `${id}-2-${project.id || idx}-${idx}`, true)
                    )}
                </div>
                <div aria-hidden="true" className="flex gap-5 shrink-0 pr-5">
                    {projects.map((project, idx) =>
                        renderCard(project, `${id}-3-${project.id || idx}-${idx}`, true)
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShowcaseReel({ projects = [], onSelectProject }) {
    // Filter projects that have displayable preview content
    const baseProjects = useMemo(() => {
        if (!projects || projects.length === 0) return [];
        const photoOnly = projects.filter((p) => Boolean(p.image_path));
        const list = photoOnly.length > 0 ? photoOnly : projects;

        // Ensure at least 6 items in the list so stride is substantial
        let expanded = [...list];
        while (expanded.length < 6) {
            expanded = expanded.concat(list);
        }
        return expanded;
    }, [projects]);

    if (baseProjects.length === 0) return null;

    return (
        <section
            id="reel"
            className="marquee-sec bg-[#0C0C0C] py-8 sm:py-12 overflow-hidden relative z-[2] border-y border-white/5 w-full max-w-[100vw]"
            aria-label="Showcase Reel"
        >
            {/* Ambient edge gradient masks for smooth entering and exiting */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#0C0C0C] to-transparent z-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#0C0C0C] to-transparent z-20" />

            {/* Single Unified Cinematic Runway */}
            <ReelRow
                id="marqueeTrack"
                baseSpeed={-70}
                projects={baseProjects}
                onSelectProject={onSelectProject}
            />
        </section>
    );
}
