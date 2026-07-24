import React, { useState } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { router, usePage, useForm } from '@inertiajs/react';
import ConfirmModal from '../../Components/Shared/ConfirmModal';

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function MessageRow({ message, isExpanded, onToggleExpand }) {
    const { adminSlug } = usePage().props;
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const { data, setData, put, processing } = useForm({
        admin_notes: message.admin_notes || '',
    });

    const handleExpand = () => {
        onToggleExpand(message.id);
        if (!message.is_read) {
            router.put(`/${adminSlug}/dashboard/messages/${message.id}/read`, {}, { preserveScroll: true });
        }
    };

    const handleSaveNotes = (e) => {
        e.preventDefault();
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
            <button
                onClick={handleExpand}
                className="w-full flex items-center gap-3 p-4 text-left"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {message.subject || 'No subject'}
                        </p>
                        {!message.is_read && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium shrink-0">
                                New
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {message.sender_name} <span className="mx-1">&middot;</span> {message.sender_email}
                    </p>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {formatDate(message.created_at)}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {isExpanded ? 'Collapse' : 'View'}
                    </p>
                </div>
            </button>

            {isExpanded && (
                <div className="px-4 pb-5 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="pt-4 pb-4">
                        <div className="p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                            <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {message.message}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSaveNotes} className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Admin Notes
                        </label>
                        <textarea
                            rows="2"
                            placeholder="Private notes, not visible to the sender"
                            value={data.admin_notes}
                            onChange={(e) => setData('admin_notes', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                        />
                        <div className="flex items-center justify-between pt-1">
                            <button
                                type="button"
                                onClick={() => setConfirmingDelete(true)}
                                className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                            >
                                Delete message
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-medium disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Notes'}
                            </button>
                        </div>
                    </form>
                </div>
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

export default function Messages({ messages }) {
    const [expandedId, setExpandedId] = useState(null);

    const handleToggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const unreadCount = messages.filter((m) => !m.is_read).length;

    return (
        <AdminLayout title="Messages" currentPath="/messages">
            {messages.length > 0 && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </p>
            )}

            <div className="space-y-2">
                {messages.length === 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No messages received yet.</p>
                )}

                {messages.map((message) => (
                    <MessageRow
                        key={message.id}
                        message={message}
                        isExpanded={expandedId === message.id}
                        onToggleExpand={handleToggleExpand}
                    />
                ))}
            </div>
        </AdminLayout>
    );
}