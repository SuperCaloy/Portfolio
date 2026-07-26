import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import useTheme from '../hooks/useTheme';
import Header from '../Components/Portfolio/Header';
import Hero from '../Components/Portfolio/Hero';
import Projects from '../Components/Portfolio/Projects';
import Skills from '../Components/Portfolio/Skills';
import Experience from '../Components/Portfolio/Experience';
import Certificates from '../Components/Portfolio/Certificates';
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

    // Scroll to matching section if landing directly on /projects, /skills, etc
    useEffect(() => {
        const path = window.location.pathname;
        const sectionId = path === '/' ? 'about' : path.replace('/', '');
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant' });
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 selection:text-zinc-900 dark:selection:text-white transition-colors duration-200">
            <Head title={name} />

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-zinc-300/20 dark:from-zinc-800/20 to-transparent blur-[120px] rounded-full" />
            </div>

            <Header
                name={name}
                hasCertificates={certificates.length > 0}
                theme={theme}
                toggleTheme={toggleTheme}
                onSecretTrigger={() => setShowAdminLogin(true)}
            />

            <main className="relative z-10 max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
                <Hero personal={personal} stats={stats} />
                <Projects projects={projects} />
                <Skills skills={skills} />
                <Experience experiences={experiences} />
                <Certificates certificates={certificates} />
                <Footer name={name} />
            </main>

            {showAdminLogin && (
                <Suspense fallback={null}>
                    <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
                </Suspense>
            )}
        </div>
    );
}