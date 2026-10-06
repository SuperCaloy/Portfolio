import React from 'react';

export default function AdminSearchInput({
    value,
    onChange,
    onClear,
    placeholder = 'Search...',
    isSearching = false,
    className = 'mb-3',
}) {
    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 pr-9 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
            {isSearching && !value && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-300 animate-spin" />
                </div>
            )}
            {value && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={onClear || (() => onChange(''))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                >
                    {isSearching ? (
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-300 animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
}
