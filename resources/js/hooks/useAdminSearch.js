import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';

export function useAdminSearch({ route, initialSearch = '', delay = 550, extraParams = {} }) {
    const [search, setSearch] = useState(initialSearch);
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimer = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            router.get(route, { search: search || undefined, ...extraParams }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                showProgress: false,
                headers: { 'X-Silent-Navigation': 'true' },
                onStart: () => setIsSearching(true),
                onFinish: () => setIsSearching(false),
            });
        }, delay);

        return () => clearTimeout(debounceTimer.current);
    }, [search, route, delay]);

    return { search, setSearch, isSearching };
}
