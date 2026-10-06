import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export function useUnsavedGuard(isDirty) {
    const [pendingUrl, setPendingUrl] = useState(null);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!isDirty) return;
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        const removeListener = router.on('before', (event) => {
            if (!isDirty || pendingUrl) return;
            if (event.detail.visit.method !== 'get') return;

            event.preventDefault();
            setPendingUrl(event.detail.visit.url.href);
        });
        return () => removeListener();
    }, [isDirty, pendingUrl]);

    const confirmLeave = () => {
        const url = pendingUrl;
        setPendingUrl(null);
        if (url) {
            router.visit(url);
        }
    };

    const cancelLeave = () => {
        setPendingUrl(null);
    };

    return {
        pendingUrl,
        confirmLeave,
        cancelLeave,
    };
}
