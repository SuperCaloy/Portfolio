import React from 'react';
import { optimizeCloudinaryUrl } from '../../utils/image';

export default function Hero({ personal, skills = [] }) {
    const name = personal?.full_name || 'Ramon Pacilona';
    const title = personal?.professional_title || 'Full Stack Software Engineer';
    const bio = personal?.bio || personal?.about_me || 'Crafting calm, high-performance web applications and monolithic systems with modern frameworks. Focused on clean relational data boundaries and memorable interaction craft.';
    const hasPhoto = Boolean(personal?.avatar_path);

    const scrollTo = (id) => (e) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) {
            if (window.lenis) {
                window.lenis.scrollTo(target, { offset: -24 });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
        window.history.pushState({}, '', '#' + id);
    };

    return (
        <section className="min-h-[85vh] min-h-[85dvh] flex flex-col justify-center items-center text-center relative z-[2] pt-28 sm:pt-36 pb-16 px-4 max-w-5xl mx-auto w-full" id="about" aria-label="Introduction">
            {/* Dynamic Profile Photo / Monogram Fallback from Database */}
            <div className="mb-6 sm:mb-8 relative group inline-block select-none">
                <div className="p-1 sm:p-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-emerald-500/50 transition-all duration-500 shadow-[0_0_35px_rgba(16,185,129,0.18)] hover:shadow-[0_0_50px_rgba(16,185,129,0.35)]">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden bg-[#121216] relative flex items-center justify-center">
                        {hasPhoto ? (
                            <img
                                src={optimizeCloudinaryUrl(personal.avatar_path, 800)}
                                alt={`${name}, profile photo`}
                                width={176}
                                height={176}
                                fetchPriority="high"
                                loading="eager"
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                            />
                        ) : (
                            <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-black text-emerald-400 select-none tracking-wider">
                                {name.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('')}
                            </span>
                        )}
                    </div>
                </div>
                <div
                    className="absolute bottom-1 right-2 sm:bottom-2 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-[#09090B] shadow-[0_0_10px_#10B981] animate-[live-pulse_2s_infinite_ease-in-out]"
                    title="Available for opportunities"
                />
            </div>

            {/* Massive Typographic Authority */}
            <h1 className="hero-name font-black uppercase tracking-tight leading-[0.95] text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 text-balance hero-heading" style={{ fontFamily: "'Kanit', sans-serif" }}>
                <span className="hidden sm:inline">{name}</span>
                <span className="inline sm:hidden">{name}</span>
            </h1>

            {/* Subtitle */}
            <div className="font-mono text-xs sm:text-sm md:text-base tracking-widest uppercase text-zinc-300 mb-6 max-w-2xl">
                <span>{title}</span>
            </div>

            {/* Bio copy */}
            <p className="text-zinc-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-normal text-pretty" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {bio}
            </p>

            {/* Island Button CTA row */}
            <div className="flex flex-wrap gap-3.5 justify-center items-center mb-6 sm:mb-8">
                <a
                    href="#contact"
                    onClick={scrollTo('contact')}
                    className="cta inline-flex items-center gap-2.5 rounded-full text-black font-bold uppercase tracking-wider text-xs px-6 py-3 min-h-[44px] bg-emerald-500 hover:bg-emerald-400 shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-0.5 no-underline cursor-pointer"
                >
                    <span>Get In Touch</span>
                    <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center transition-transform duration-200">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </span>
                </a>

                <a
                    href="#featured-works"
                    onClick={scrollTo('featured-works')}
                    className="ghost inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white font-semibold uppercase tracking-wider text-xs px-5 py-3 min-h-[44px] transition-all duration-300 hover:-translate-y-0.5 no-underline cursor-pointer"
                >
                    <span>Explore Featured Works</span>
                </a>

                <a
                    href={personal?.resume_path || '/resume'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-btn inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-semibold uppercase tracking-wider text-xs px-5 py-3 min-h-[44px] transition-all duration-300 hover:-translate-y-0.5 no-underline cursor-pointer"
                >
                    <span>Resume</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </a>
            </div>
        </section>
    );
}