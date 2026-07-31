import { router } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    const goToPage = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <nav className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
            {links.map((link, idx) => (
                <button
                    key={idx}
                    disabled={!link.url}
                    onClick={() => goToPage(link.url)}
                    className={`px-3 py-1.5 rounded-md text-sm font-mono border transition-colors
                        ${link.active
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'}
                        ${!link.url ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </nav>
    );
}