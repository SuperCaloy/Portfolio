import React from 'react';
import { useInView } from '../../hooks/useInView';

export default function AnimatedItem({ children, index = 0, delay = 50 }) {
    const [ref, isInView] = useInView();
    return (
        <div 
            ref={ref} 
            className={`transition-all duration-700 ease-fluid ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * delay}ms` }}
        >
            {children}
        </div>
    );
}
