import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import SmoothScroll from './Components/SmoothScroll';

const appName = import.meta.env.VITE_APP_NAME || 'Portfolio';

createInertiaApp({
    title: (title) => title,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
        <SmoothScroll>
            <App {...props} />
        </SmoothScroll>
    );
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transform = 'scale(0.98)';
            loader.style.pointerEvents = 'none';
            setTimeout(() => loader.remove(), 400);
        }
    },
    progress: {
        color: '#3B82F6',
    },
});