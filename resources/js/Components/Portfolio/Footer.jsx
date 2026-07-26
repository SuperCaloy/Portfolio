import React from 'react';

export default function Footer({ name }) {
    return (
        <footer className="pt-12 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 font-mono">
            <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-600">Built with Laravel, Inertia, React & Tailwind</p>
        </footer>
    );
}