import React, { useState } from 'react';

export default function TagInput({
    tags = [],
    onChange,
    placeholder = 'Add tag...',
    label = null,
    error = null,
    className = '',
}) {
    const [inputValue, setInputValue] = useState('');

    const addTag = (text) => {
        const trimmed = text.trim();
        if (!trimmed || tags.includes(trimmed)) return;
        onChange([...tags, trimmed]);
        setInputValue('');
    };

    const removeTag = (tagToRemove) => {
        onChange(tags.filter((t) => t !== tagToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        }
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {label}
                </label>
            )}

            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 min-h-[42px] items-center">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                            aria-label={`Remove tag ${tag}`}
                        >
                            &times;
                        </button>
                    </span>
                ))}

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none placeholder-zinc-400"
                />
            </div>

            {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>
    );
}
