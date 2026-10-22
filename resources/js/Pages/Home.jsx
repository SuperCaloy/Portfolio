import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import Atmosphere from '../Components/Portfolio/Atmosphere';
import Header from '../Components/Portfolio/Header';
import Hero from '../Components/Portfolio/Hero';
import ShowcaseReel from '../Components/Portfolio/ShowcaseReel';
import About from '../Components/Portfolio/About';
import Projects from '../Components/Portfolio/Projects';
import Skills from '../Components/Portfolio/Skills';
import Experience from '../Components/Portfolio/Experience';
import Certificates from '../Components/Portfolio/Certificates';
import Contact from '../Components/Portfolio/Contact';
import Footer from '../Components/Portfolio/Footer';
import BackToTop from '../Components/Portfolio/BackToTop';
import { calculateExperienceLabel } from '../utils/date';

// Lazy loaded so this never ships in the public bundle until triggered
const AdminLoginModal = lazy(() => import('../Components/Admin/AdminLoginModal'));

export default function Home({
    personal = {},
    skills = [],
    projects = [],
    experiences = [],
    certificates = []
}) {
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const name = personal?.full_name || 'Ramon Pacilona';
    const fullTitle = `${name} | ${personal?.professional_title || 'Backend Developer & Cybersecurity'}`;

    const experienceLabel = calculateExperienceLabel(experiences);

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

    // Scroll to matching section on direct land or browser back/forward navigation
    useEffect(() => {
        const scrollToPath = () => {
            const hash = window.location.hash;
            const path = window.location.pathname;
            const sectionId = hash ? hash.replace('#', '') : (path !== '/' ? path.replace('/', '') : '');
            if (sectionId) {
                const el = document.getElementById(sectionId);
                if (el) {
                    requestAnimationFrame(() => {
                        el.scrollIntoView({ behavior: 'auto', block: 'start' });
                    });
                    return;
                }
            }
            if (!hash) {
                window.scrollTo({ top: 0, behavior: 'auto' });
            }
        };

        scrollToPath();
        window.addEventListener('popstate', scrollToPath);
        return () => window.removeEventListener('popstate', scrollToPath);
    }, []);

    const description = `${name}, ${personal?.professional_title || 'Software Engineer'}. ${personal?.bio || personal?.about_me || 'Portfolio showcasing projects, skills, and experience.'}`;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ramonpacilona.site';
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        "jobTitle": personal?.professional_title || 'Software Engineer',
        "url": baseUrl,
        "sameAs": [
            personal?.github_url,
            personal?.linkedin_url
        ].filter(Boolean),
        "description": description
    };

    if (personal?.avatar_path) {
        structuredData.image = baseUrl + personal.avatar_path;
    }

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-100">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2.5 focus:bg-emerald-500 focus:text-black focus:font-semibold focus:rounded-lg focus:shadow-2xl focus:outline-none"
            >
                Skip to content
            </a>

            <Head title={fullTitle}>
                <meta name="description" content={description} />
                <meta property="og:title" content={fullTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={baseUrl} />
                <meta property="og:type" content="website" />
                {personal?.avatar_path && <meta property="og:image" content={`${baseUrl}${personal.avatar_path}`} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={fullTitle} />
                <meta name="twitter:description" content={description} />
                {personal?.avatar_path && <meta name="twitter:image" content={`${baseUrl}${personal.avatar_path}`} />}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
            </Head>

            <div className="grain-overlay" />
            <Atmosphere />
            <Header
                name={name}
                hasCertificates={certificates.length > 0}
                onSecretTrigger={() => setShowAdminLogin(true)}
            />

            <main id="main" tabIndex={-1} className="relative z-10 w-full outline-none">
                <Hero personal={personal} />
                <ShowcaseReel projects={projects} onSelectProject={setSelectedProject} />
                <About personal={personal} skills={skills} />
                <Projects
                    projects={projects}
                    skills={skills}
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                />
                <Skills skills={skills} />
                <Experience experiences={experiences} />
                <Certificates certificates={certificates} />
                <Contact />
            </main>

            <Footer name={name} githubUrl={personal?.github_url} linkedinUrl={personal?.linkedin_url} />

            <BackToTop />

            {showAdminLogin && (
                <Suspense fallback={null}>
                    <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
                </Suspense>
            )}
        </div>
    );
}