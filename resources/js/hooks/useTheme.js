import { useState, useEffect } from 'react';

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                return localStorage.getItem('theme') || 'dark';
            } catch {
                return 'dark';
            }
        }
        return 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch {
            // Storage access blocked or restricted
        }
    }, [theme]);

    const toggleTheme = () => {
        document.documentElement.classList.add('theme-transitioning');
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 300);
    };

    return { theme, toggleTheme };
}