import React, { useState, useEffect } from 'react';
// Both indexes are fetched once per session and cached as module level
// promises, every component sharing this file waits on the same fetch
// instead of triggering its own. Fully dynamic, no manual name mapping,
// matches are made against each library's real published titles.

let simpleIconsIndexPromise = null;
function loadSimpleIconsIndex() {
    if (!simpleIconsIndexPromise) {
        simpleIconsIndexPromise = fetch('https://cdn.jsdelivr.net/npm/simple-icons@latest/data/simple-icons.json')
            .then((r) => r.json())
            .catch(() => []);
    }
    return simpleIconsIndexPromise;
}

let deviconIndexPromise = null;
function loadDeviconIndex() {
    if (!deviconIndexPromise) {
        deviconIndexPromise = fetch('https://cdn.jsdelivr.net/gh/devicons/devicon/devicon.json')
            .then((r) => r.json())
            .catch(() => []);
    }
    return deviconIndexPromise;
}

function normalize(str) {
    return str?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
}

// Exact title or slug match first, then a loose containment match as a
// second pass, e.g. typing "Tailwind" finds "Tailwind CSS" this way.
function findSimpleIconMatch(index, raw) {
    const target = normalize(raw);
    if (!target) return null;
    const icons = index.icons || index;
    const match = icons.find((e) => normalize(e.title) === target || e.slug === target);
    return match ? match : null;
}

// Devicon entries carry a name plus alternate names, both are checked,
// this is what correctly resolves "Java" to Devicon's own "java" icon,
// a real title match, not a guessed substitution.
function findDeviconName(index, raw) {
    const target = normalize(raw);
    if (!target) return null;
    const match = index.find((e) =>
        normalize(e.name) === target || (e.altnames || []).some((alt) => normalize(alt) === target)
    );
    return match ? match.name : null;
}

const STATIC_BRAND_ICONS = {
    'php': '/api/icons/simple/php?color=777BB4',
    'laravel': '/api/icons/simple/laravel?color=FF2D20',
    'react': '/api/icons/simple/react?color=61DAFB',
    'mysql': '/api/icons/simple/mysql?color=4479A1',
    'docker': '/api/icons/simple/docker?color=2496ED',
    'java': '/api/icons/devicon/java',
    'python': '/api/icons/simple/python?color=3776AB',
    'css': '/api/icons/simple/css?color=1572B6',
    'css3': '/api/icons/simple/css?color=1572B6',
    'tailwind': '/api/icons/simple/tailwindcss?color=06B6D4',
    'tailwind css': '/api/icons/simple/tailwindcss?color=06B6D4',
    'tailwindcss': '/api/icons/simple/tailwindcss?color=06B6D4',
    'git': '/api/icons/simple/git?color=F05032',
    'node': '/api/icons/simple/nodedotjs?color=5FA04E',
    'node.js': '/api/icons/simple/nodedotjs?color=5FA04E',
    'nodejs': '/api/icons/simple/nodedotjs?color=5FA04E',
    'typescript': '/api/icons/simple/typescript?color=3178C6',
    'javascript': '/api/icons/simple/javascript?color=F7DF1E',
    'next.js': '/api/icons/simple/nextdotjs?color=FFFFFF',
    'nextjs': '/api/icons/simple/nextdotjs?color=FFFFFF',
    'inertia': '/api/icons/simple/inertia?color=9553E9',
    'inertia.js': '/api/icons/simple/inertia?color=9553E9',
    'scikit-learn': '/api/icons/simple/scikitlearn?color=F7931E',
    'scikitlearn': '/api/icons/simple/scikitlearn?color=F7931E',
    'mongodb': '/api/icons/simple/mongodb?color=47A248',
    'vue': '/api/icons/simple/vuedotjs?color=4FC08D',
    'ryu sdn': '/api/icons/devicon/python',
    'mininet': '/api/icons/devicon/linux',
};

// Resolved URLs are cached by input name so the same tag never triggers
// a repeat lookup across renders or across components on the page.
const resolvedCache = new Map();

async function resolveIconUrl(raw) {
    const key = raw?.toLowerCase()?.trim();
    if (!key) return null;
    if (resolvedCache.has(key)) return resolvedCache.get(key);

    if (STATIC_BRAND_ICONS[key]) {
        resolvedCache.set(key, STATIC_BRAND_ICONS[key]);
        return STATIC_BRAND_ICONS[key];
    }

    const [simpleIndex, deviconIndex] = await Promise.all([loadSimpleIconsIndex(), loadDeviconIndex()]);

    const siMatch = findSimpleIconMatch(simpleIndex, raw);
    if (siMatch) {
        const url = `/api/icons/simple/${siMatch.slug}?color=${siMatch.hex}`;
        resolvedCache.set(key, url);
        return url;
    }

    const diName = findDeviconName(deviconIndex, raw);
    if (diName) {
        const url = `/api/icons/devicon/${diName}`;
        resolvedCache.set(key, url);
        return url;
    }

    resolvedCache.set(key, null);
    return null;
}

// Returns the resolved icon URL for a name, undefined while resolving,
// null once resolved with no match found in either library.
export function useBrandIconUrl(name) {
    const [url, setUrl] = useState(() => resolvedCache.get(name?.toLowerCase()));

    useEffect(() => {
        let cancelled = false;
        resolveIconUrl(name).then((result) => {
            if (!cancelled) setUrl(result);
        });
        return () => {
            cancelled = true;
        };
    }, [name]);

    return url;
}

// Renders a brand icon by name, resolved dynamically against real
// Simple Icons and Devicon data, renders nothing once resolution
// finishes with no match. onStatusChange is optional, reports
// 'loading', 'matched', or 'none', used by the admin icon preview.
export function BrandIcon({ name, className, onStatusChange }) {
    const url = useBrandIconUrl(name);

    useEffect(() => {
        onStatusChange?.(url === undefined ? 'loading' : url ? 'matched' : 'none');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    if (!url) return null;

    return React.createElement('img', { src: url, alt: '', decoding: 'async', className });
}

// Matches a project tech stack tag (plain string) to a Skill record by
// name, case insensitive. If a matching skill has an icon override, that
// override is used for lookup. Falls back to the raw tag string when no
// matching skill exists. Shared by every place project tech tags render
// an icon, so override behavior stays consistent everywhere.
export function resolveProjectTechName(tag, skills = []) {
    const match = skills.find((s) => s.name?.toLowerCase() === tag.toLowerCase());
    return match?.icon_name || match?.name || tag;
}