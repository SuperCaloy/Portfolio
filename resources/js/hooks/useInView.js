import { useEffect, useRef, useState, useCallback } from 'react';

// Triggers once when the element enters the viewport, stays true after.
// Supports both ref objects and callback refs for late-mounted elements.
export function useInView(threshold = 0.15) {
    const [node, setNode] = useState(null);
    const [isInView, setIsInView] = useState(false);
    const refObj = useRef(null);

    const ref = useCallback((element) => {
        refObj.current = element;
        setNode(element);
    }, []);

    ref.current = refObj.current;

    useEffect(() => {
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
    }, [node, threshold]);

    return [ref, isInView];
}

export default useInView;