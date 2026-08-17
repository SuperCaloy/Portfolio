import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import useTheme from '../hooks/useTheme';
import Header from '../Components/Portfolio/Header';
import Hero from '../Components/Portfolio/Hero';
import Projects from '../Components/Portfolio/Projects';
import Skills from '../Components/Portfolio/Skills';
import Experience from '../Components/Portfolio/Experience';
import Certificates from '../Components/Portfolio/Certificates';
import Contact from '../Components/Portfolio/Contact';
import Footer from '../Components/Portfolio/Footer';

// Lazy loaded so this never ships in the public bundle until triggered
const AdminLoginModal = lazy(() => import('../Components/Admin/AdminLoginModal'));

export default function Home({
    personal = {},
    skills = [],
    projects = [],
    experiences = [],
    certificates = []
}) {
    const { theme, toggleTheme } = useTheme();
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const name = personal?.full_name || 'Your Name';
    
    // Experience label calculated by summing the actual duration of every
    // experience entry, not the span since the earliest start date. This
    // avoids overcounting gaps between jobs and correctly adds up multiple
    // part time or short entries.
    const experienceLabel = (() => {
        if (experiences.length === 0) return null;

        const totalMonths = experiences.reduce((sum, exp) => {
            if (!exp.start_date) return sum;
            const start = new Date(exp.start_date);
            const end = exp.end_date ? new Date(exp.end_date) : new Date();
            const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
            return sum + Math.max(0, months);
        }, 0);

        const roundedMonths = Math.max(1, Math.round(totalMonths));

        if (roundedMonths < 12) {
            return `${roundedMonths} Month${roundedMonths > 1 ? 's' : ''} Experience`;
        }

        const years = Math.round(roundedMonths / 12);
        return `${years}+ Year${years > 1 ? 's' : ''} Experience`;
    })();

    const stats = {
        projects: projects.length,
        experienceLabel,
        certificates: certificates.length,
    };

    // Ctrl+Shift+A opens admin login on desktop
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
                setShowAdminLogin(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Scroll to matching section if landing directly on /projects, /tech, etc
    useEffect(() => {
        const path = window.location.pathname;
        const sectionId = path === '/' ? 'about' : path.replace('/', '');
        const el = document.getElementById(sectionId);
        if (el) {
            requestAnimationFrame(() => {
                el.scrollIntoView({ behavior: 'auto', block: 'start' });
            });
        }
    }, []);

    const description = `${name}, ${personal?.professional_title || 'Software Engineer'}. ${personal?.bio || personal?.about_me || 'Portfolio showcasing projects, skills, and experience.'}`;
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        "jobTitle": personal?.professional_title || 'Software Engineer',
        "url": "https://ramonpacilona.site",
        "sameAs": [
            personal?.github_url,
            personal?.linkedin_url
        ].filter(Boolean),
        "description": description
    };

    if (personal?.avatar_path) {
        structuredData.image = "https://ramonpacilona.site" + personal.avatar_path;
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/20 dark:selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors duration-700 ease-fluid">
            <Head title={name}>
                <meta name="description" content={description} />
                <meta property="og:title" content={name} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content="https://ramonpacilona.site" />
                <meta property="og:type" content="website" />
                {personal?.avatar_path && <meta property="og:image" content={`https://ramonpacilona.site${personal.avatar_path}`} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={name} />
                <meta name="twitter:description" content={description} />
                {personal?.avatar_path && <meta name="twitter:image" content={`https://ramonpacilona.site${personal.avatar_path}`} />}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            </Head>

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-zinc-300/20 dark:from-zinc-800/20 to-transparent blur-[120px] rounded-full" />
                <div className="absolute top-[15%] right-[5%] w-[300px] h-[300px] bg-emerald-400/10 dark:bg-emerald-500/10 blur-[100px] rounded-full" />
                <div
                    className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
            </div>
            <div className="grain-overlay" />           
            <Header
                name={name}
                hasCertificates={certificates.length > 0}
                theme={theme}
                toggleTheme={toggleTheme}
                onSecretTrigger={() => setShowAdminLogin(true)}
            />

            <main className="relative z-10 max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 space-y-24 sm:space-y-32 lg:space-y-40">
                <Hero personal={personal} stats={stats} />
                <Projects projects={projects} skills={skills} />
                <Skills skills={skills} />
                <Experience experiences={experiences} />
                <Certificates certificates={certificates} />
            </main>

            <div className="relative z-10">
                <Contact />
                <Footer name={name} githubUrl={personal?.github_url} linkedinUrl={personal?.linkedin_url} />
            </div>

            {showAdminLogin && (
                <Suspense fallback={null}>
                    <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
                </Suspense>
            )}
        </div>
    );
}