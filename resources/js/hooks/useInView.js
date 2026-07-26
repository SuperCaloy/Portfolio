import { useEffect, useRef, useState } from 'react';

// Triggers once when the element enters the viewport, stays true after
export default function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, isInView];
}