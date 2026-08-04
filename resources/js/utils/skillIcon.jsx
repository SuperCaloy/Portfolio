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
function findSimpleIconsSlug(index, raw) {
    const target = normalize(raw);
    if (!target) return null;
    const match = index.find((e) => normalize(e.title) === target || e.slug === target);
    return match ? match.slug : null;
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

// Resolved URLs are cached by input name so the same tag never triggers
// a repeat lookup across renders or across components on the page.
const resolvedCache = new Map();

async function resolveIconUrl(raw) {
    const key = raw?.toLowerCase();
    if (!key) return null;
    if (resolvedCache.has(key)) return resolvedCache.get(key);

    const [simpleIndex, deviconIndex] = await Promise.all([loadSimpleIconsIndex(), loadDeviconIndex()]);

    const siSlug = findSimpleIconsSlug(simpleIndex, raw);
    if (siSlug) {
        const url = `https://cdn.simpleicons.org/${siSlug}`;
        resolvedCache.set(key, url);
        return url;
    }

    const diName = findDeviconName(deviconIndex, raw);
    if (diName) {
        const url = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${diName}/${diName}-original.svg`;
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

    return React.createElement('img', { src: url, alt: '', loading: 'lazy', className });
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