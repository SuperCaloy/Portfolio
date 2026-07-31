import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { router, usePage, useForm } from '@inertiajs/react';
import ConfirmModal from '../../Components/Shared/ConfirmModal';
import Pagination from '../../Components/Shared/Pagination';

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function MessageRow({ message, isExpanded, onToggleExpand, adminSlug, isSelected, onToggleSelect }) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [confirmingSaveNotes, setConfirmingSaveNotes] = useState(false);
    const { data, setData, put, processing } = useForm({
        admin_notes: message.admin_notes || '',
    });

    const handleExpand = () => {
        onToggleExpand(message.id);
        if (!message.is_read) {
            router.put(`/${adminSlug}/dashboard/messages/${message.id}/read`, {}, {
                preserveScroll: true,
                showProgress: false,
                headers: { 'X-Silent-Navigation': 'true' },
            });
        }
    };

    const handleSaveNotes = (e) => {
        e.preventDefault();
        setConfirmingSaveNotes(true);
    };

    const confirmSaveNotes = () => {
        setConfirmingSaveNotes(false);
        put(`/${adminSlug}/dashboard/messages/${message.id}/notes`, {
            preserveScroll: true,
        });
    };

    const confirmDelete = () => {
        router.delete(`/${adminSlug}/dashboard/messages/${message.id}`);
        setConfirmingDelete(false);
    };

    return (
        <div className={`rounded-xl border overflow-hidden transition-colors ${
            message.is_read
                ? 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800/80'
                : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700'
        }`}>
            <div className="w-full flex items-center gap-3 p-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(message.id)}
                    className="shrink-0 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 cursor-pointer"
                />
                <button
                    onClick={handleExpand}
                    className="flex-1 min-w-0 flex items-center gap-3 text-left"
                >
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {message.subject || 'No subject'}
                        </p>
                        {!message.is_read && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium shrink-0">
                                New
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {message.sender_name} <span className="mx-1">&middot;</span> {message.sender_email}
                    </p>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {formatDate(message.created_at)}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {isExpanded ? 'Collapse' : 'View'}
                    </p>
                </div>
                </button>
            </div>

            {isExpanded && (
                <div className="px-4 pb-5 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="pt-4 pb-4">
                        <div className="p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {message.message}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSaveNotes} className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Admin Notes
                        </label>
                        <textarea
                            rows="2"
                            placeholder="Private notes, not visible to the sender"
                            value={data.admin_notes}
                            onChange={(e) => setData('admin_notes', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                        />
                        <div className="flex items-center justify-between pt-1">
                            <button
                                type="button"
                                onClick={() => setConfirmingDelete(true)}
                                className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                            >
                                Delete message
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-sm font-medium disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Notes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {confirmingSaveNotes && (
                <ConfirmModal
                    title="Save admin notes?"
                    message="These notes are private and only visible to you."
                    onConfirm={confirmSaveNotes}
                    onCancel={() => setConfirmingSaveNotes(false)}
                />
            )}

            {confirmingDelete && (
                <ConfirmModal
                    title="Delete this message?"
                    message="This action cannot be undone."
                    danger
                    onConfirm={confirmDelete}
                    onCancel={() => setConfirmingDelete(false)}
                />
            )}
        </div>
    );
}

export default function Messages({ messages, filters }) {
    const { adminSlug } = usePage().props;
    const [expandedId, setExpandedId] = useState(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkProcessing, setBulkProcessing] = useState(false);
    const [confirmingBulkDelete, setConfirmingBulkDelete] = useState(false);
    const debounceTimer = useRef(null);
    const isFirstRender = useRef(true);

    const handleToggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleToggleSelectAll = () => {
        const pageIds = messages.data.map((m) => m.id);
        const allSelected = pageIds.every((id) => selectedIds.includes(id));
        setSelectedIds(allSelected ? [] : pageIds);
    };

    const handleBulkMarkRead = () => {
        setBulkProcessing(true);
        router.put(`/${adminSlug}/dashboard/messages/bulk/read`, { ids: selectedIds }, {
            preserveScroll: true,
            onFinish: () => {
                setBulkProcessing(false);
                setSelectedIds([]);
            },
        });
    };

    const handleBulkDelete = () => {
        setBulkProcessing(true);
        router.delete(`/${adminSlug}/dashboard/messages/bulk`, {
            data: { ids: selectedIds },
            preserveScroll: true,
            onFinish: () => {
                setBulkProcessing(false);
                setSelectedIds([]);
                setConfirmingBulkDelete(false);
            },
        });
    };

    // Debounced server side search, resets to page 1 on every new search term.
    // showProgress: false stops Inertia's global top bar from firing here,
    // the input's own spinner (isSearching) covers the loading feedback instead.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            router.get(`/${adminSlug}/dashboard/messages`, { search, page: 1 }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                showProgress: false,
                headers: { 'X-Silent-Navigation': 'true' },
                onStart: () => setIsSearching(true),
                onFinish: () => setIsSearching(false),
            });
        }, 550);

        return () => clearTimeout(debounceTimer.current);
    }, [search]);

    // Clears selection whenever the visible page of messages changes,
    // covers pagination, search, and post bulk action reloads.
    useEffect(() => {
        setSelectedIds([]);
    }, [messages.data]);

    const unreadCount = messages.data.filter((m) => !m.is_read).length;
    const allOnPageSelected = messages.data.length > 0 && messages.data.every((m) => selectedIds.includes(m.id));

    return (
        <AdminLayout title="Messages" currentPath={`/${adminSlug}/dashboard/messages`}>
            {messages.total > 0 && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    {unreadCount > 0 ? `${unreadCount} unread on this page` : 'All caught up on this page'}
                </p>
            )}

            <div className="relative mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search messages by sender or subject"
                    className="w-full px-3 py-2 pr-9 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
                {isSearching && !search && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-300 animate-spin" />
                    </div>
                )}
                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch('')}
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

            {messages.data.length > 0 && (
                <div className="flex items-center gap-3 mb-3 px-1">
                    <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={handleToggleSelectAll}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select all'}
                    </span>

                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                type="button"
                                onClick={handleBulkMarkRead}
                                disabled={bulkProcessing}
                                className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-medium disabled:opacity-50"
                            >
                                Mark Read
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmingBulkDelete(true)}
                                disabled={bulkProcessing}
                                className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium disabled:opacity-50"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-2">
                {messages.data.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {search ? 'No messages match your search.' : 'No messages received yet.'}
                    </p>
                )}

                {messages.data.map((message) => (
                    <MessageRow
                        key={message.id}
                        message={message}
                        isExpanded={expandedId === message.id}
                        onToggleExpand={handleToggleExpand}
                        adminSlug={adminSlug}
                        isSelected={selectedIds.includes(message.id)}
                        onToggleSelect={handleToggleSelect}
                    />
                ))}
            </div>

            <Pagination links={messages.links} />

            {confirmingBulkDelete && (
                <ConfirmModal
                    title={`Delete ${selectedIds.length} messages?`}
                    message="This action cannot be undone."
                    danger
                    onConfirm={handleBulkDelete}
                    onCancel={() => setConfirmingBulkDelete(false)}
                />
            )}
        </AdminLayout>
    );
}