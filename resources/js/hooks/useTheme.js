import { useState, useEffect } from 'react';

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
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