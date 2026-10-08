import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';

const ARTIFACTS = [
    {
        id: 'network-node',
        src: '/images/artifacts/network_node_icon.png',
        alt: 'Interactive 3D Encrypted Network Node',
        positionClass: 'tl top-[4%] left-[2%] sm:left-[3%]',
        sizeClass: 'w-[42px] sm:w-[68px] md:w-[92px] lg:w-[112px]',
        floatClass: 'animate-float-1',
        glowColor: 'rgba(16, 185, 129, 0.55)',
        parallaxFactor: 16,
    },
    {
        id: 'terminal-core',
        src: '/images/artifacts/terminal_core_icon.png',
        alt: 'Interactive 3D Terminal Binary Core',
        positionClass: 'tr top-[4%] right-[2%] sm:right-[3%]',
        sizeClass: 'w-[42px] sm:w-[68px] md:w-[92px] lg:w-[112px]',
        floatClass: 'animate-float-3',
        glowColor: 'rgba(6, 182, 212, 0.55)',
        parallaxFactor: -16,
    },
    {
        id: 'cyber-shield',
        src: '/images/artifacts/shield_icon.png',
        alt: 'Interactive 3D Cyber Defense Shield',
        positionClass: 'bl bottom-[5%] left-[2%] sm:left-[3%]',
        sizeClass: 'w-[42px] sm:w-[68px] md:w-[92px] lg:w-[112px]',
        floatClass: 'animate-float-2',
        glowColor: 'rgba(16, 185, 129, 0.65)',
        parallaxFactor: -14,
    },
    {
        id: 'database-cluster',
        src: '/images/artifacts/database_cluster_icon.png',
        alt: 'Interactive 3D Relational Database Cluster',
        positionClass: 'br bottom-[5%] right-[2%] sm:right-[3%]',
        sizeClass: 'w-[42px] sm:w-[68px] md:w-[92px] lg:w-[112px]',
        floatClass: 'animate-float-4',
        glowColor: 'rgba(52, 211, 153, 0.55)',
        parallaxFactor: 18,
    },
];

function InteractiveArtifact({ artifact, mousePos, isVisible, reduceMotion }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);

    const handleClick = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 650);
    };

    const px = reduceMotion ? 0 : mousePos.x * artifact.parallaxFactor;
    const py = reduceMotion ? 0 : mousePos.y * Math.abs(artifact.parallaxFactor) * 0.8;
    const tiltX = reduceMotion ? 0 : -mousePos.y * 14;
    const tiltY = reduceMotion ? 0 : mousePos.x * 14;

    return (
        <div
            className={`corner-artifact ${artifact.positionClass} ${artifact.sizeClass} absolute z-[3] select-none cursor-pointer transition-transform duration-300 ease-out pointer-events-auto touch-pan-y`}
            style={{
                transform: `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`,
                willChange: isVisible ? 'transform' : 'auto',
            }}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            tabIndex={0}
            aria-label={artifact.alt}
            title="Click to inspect 3D core"
        >
            <div
                className={`w-full h-full ${reduceMotion || !isVisible ? '' : artifact.floatClass}`}
                style={{
                    animationPlayState: isHovered || isSpinning || !isVisible ? 'paused' : 'running',
                }}
            >
                <img
                    src={artifact.src}
                    alt={artifact.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto block select-none pointer-events-none transition-all duration-500 ease-out"
                    style={{
                        transform: isSpinning
                            ? 'rotate(360deg) scale(1.22)'
                            : isHovered
                            ? `perspective(600px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) scale(1.12)`
                            : `perspective(600px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) scale(1)`,
                        filter: isHovered || isSpinning
                            ? `drop-shadow(0 16px 30px ${artifact.glowColor}) brightness(1.15)`
                            : 'drop-shadow(0 12px 20px rgba(0, 0, 0, 0.75))',
                        opacity: isHovered ? 1 : 0.88,
                    }}
                    onError={(e) => {
                        if (e.currentTarget?.parentElement?.parentElement) {
                            e.currentTarget.parentElement.parentElement.style.display = 'none';
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default function About({ personal = {}, skills = [] }) {
    const sectionRef = useRef(null);
    const charsRef = useRef([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(true);
    const [reduceMotion, setReduceMotion] = useState(false);
    const rafIdRef = useRef(null);

    // Dynamic title and story text directly from database
    const headingText = useMemo(() => {
        return personal?.professional_title || 'Backend Systems & Application Security';
    }, [personal]);

    const aboutText = useMemo(() => {
        return personal?.about_me || personal?.bio || 'Computer Science student exploring backend systems, application security, and hands-on software development.';
    }, [personal]);

    // Structured words for fluid character lighting reveal
    const structuredWords = useMemo(() => {
        if (!aboutText) return [];
        let indexTracker = 0;
        return aboutText.split(' ').map((word) => {
            return word.split('').map((char) => ({
                char,
                idx: indexTracker++,
            }));
        });
    }, [aboutText]);

    const totalCharactersCount = useMemo(() => {
        return structuredWords.reduce((acc, word) => acc + word.length, 0);
    }, [structuredWords]);

    // IntersectionObserver to pause heavy renders when section is out of viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Check reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduceMotion(mediaQuery.matches);

        const handleChange = (e) => setReduceMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Pointer move handler with RAF throttling
    const handleMouseMove = useCallback((e) => {
        if (!isVisible || reduceMotion || !sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const normX = Math.max(-1, Math.min(1, (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)));
        const normY = Math.max(-1, Math.min(1, (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)));

        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
            setMousePos({ x: normX, y: normY });
        });
    }, [isVisible, reduceMotion]);

    const handleMouseLeave = useCallback(() => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        setMousePos({ x: 0, y: 0 });
    }, []);

    // Scroll progress handler for character lighting and touch parallax
    useEffect(() => {
        if (reduceMotion) {
            charsRef.current.forEach((el) => {
                if (el) el.style.opacity = '1';
            });
            return;
        }

        const handleScroll = () => {
            if (!sectionRef.current || !isVisible) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const vh = window.innerHeight;
            const total = rect.height;
            const current = vh - rect.top;
            const progress = Math.max(0, Math.min(1, current / (total + vh * 0.4)));

            const litCount = Math.floor(progress * totalCharactersCount * 1.3);

            charsRef.current.forEach((el, idx) => {
                if (!el) return;
                if (idx <= litCount) {
                    el.style.opacity = '1';
                    el.style.color = '#FFFFFF';
                } else {
                    el.style.opacity = '0.25';
                    el.style.color = '#94A3B8';
                }
            });

            // On touch devices without active mouse pointer, drive subtle tilt via scroll progress
            const isTouch = window.matchMedia('(pointer: coarse)').matches;
            if (isTouch) {
                const scrollTiltY = (progress - 0.5) * 1.2;
                setMousePos((prev) => ({ x: prev.x, y: scrollTiltY }));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isVisible, reduceMotion, totalCharactersCount]);

    return (
        <section
            id="story"
            ref={sectionRef}
            className="about-sec relative min-h-[80vh] min-h-[80dvh] flex flex-col items-center justify-center py-24 sm:py-32 px-4 overflow-hidden z-[2]"
            aria-label="About Philosophy & Architecture"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Interactive 3D Floating Domain Artifacts */}
            {ARTIFACTS.map((artifact) => (
                <InteractiveArtifact
                    key={artifact.id}
                    artifact={artifact}
                    mousePos={mousePos}
                    isVisible={isVisible}
                    reduceMotion={reduceMotion}
                />
            ))}

            <div className="about-center relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
                {/* Dynamic Role / Title from Database */}
                <h2
                    className="about-h font-black uppercase text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-8 hero-heading"
                    style={{ fontFamily: "'Kanit', sans-serif" }}
                >
                    {headingText}
                </h2>

                {/* Character Lighting Reveal Text with Natural Word Wrapping */}
                <p
                    id="revealText"
                    className="reveal-text text-zinc-300 font-normal sm:font-medium leading-relaxed max-w-2xl text-base sm:text-lg md:text-xl select-none"
                >
                    {structuredWords.map((word, wIdx) => (
                        <React.Fragment key={wIdx}>
                            <span className="word-wrap inline-block whitespace-nowrap">
                                {word.map(({ char, idx }) => (
                                    <span
                                        key={idx}
                                        ref={(el) => (charsRef.current[idx] = el)}
                                        className="ch inline-block opacity-25 transition-opacity duration-150"
                                    >
                                        {char}
                                    </span>
                                ))}
                            </span>
                            {wIdx < structuredWords.length - 1 && (
                                <span className="word-space inline-block">&nbsp;</span>
                            )}
                        </React.Fragment>
                    ))}
                </p>
            </div>
        </section>
    );
}
