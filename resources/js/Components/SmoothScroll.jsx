import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease-out-expo
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        window.lenis = lenis;

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
        
        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            window.lenis = null;
        };
    }, []);

    return <>{children}</>;
}
