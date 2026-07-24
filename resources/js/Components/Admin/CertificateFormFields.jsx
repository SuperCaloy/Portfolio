import React, { useState } from 'react';
import ConfirmModal from '../Shared/ConfirmModal';

const STATUSES = ['Completed', 'In Progress', 'Expired'];

export default function CertificateFormFields({ data, setData, errors, certificate }) {
    const [confirmingRemove, setConfirmingRemove] = useState(false);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Issuer</label>
                    <input
                        type="text"
                        value={data.issuer}
                        onChange={(e) => setData('issuer', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.issuer && <p className="text-[11px] text-rose-500">{errors.issuer}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Issue Date</label>
                    <input
                        type="date"
                        value={data.issue_date}
                        onChange={(e) => setData('issue_date', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.issue_date && <p className="text-[11px] text-rose-500">{errors.issue_date}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Expiration Date</label>
                    <input
                        type="date"
                        value={data.expiration_date}
                        onChange={(e) => setData('expiration_date', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.expiration_date && <p className="text-[11px] text-rose-500">{errors.expiration_date}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Credential ID</label>
                    <input
                        type="text"
                        value={data.credential_id}
                        onChange={(e) => setData('credential_id', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Credential URL</label>
                    <input
                        type="text"
                        value={data.credential_url}
                        onChange={(e) => setData('credential_url', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    {errors.credential_url && <p className="text-[11px] text-rose-500">{errors.credential_url}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Status</label>
                    <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">Badge Image</label>

                    {data.image ? (
                        <div className="flex items-center gap-2">
                            <img src={URL.createObjectURL(data.image)} alt="Preview" className="w-10 h-10 rounded-md object-cover border border-zinc-200 dark:border-zinc-800" />
                            <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[140px]">{data.image.name}</span>
                            <button type="button" onClick={() => setData('image', null)} className="text-zinc-500 hover:text-rose-500 text-xs">
                                x
                            </button>
                        </div>
                    ) : certificate?.image_path && !data.remove_image ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="w-10 h-10 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={certificate.image_path}
                                    alt="Current badge"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[140px]">
                                {certificate.image_path.split('/').pop()}
                            </span>
                            <label className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium cursor-pointer">
                                Replace
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => { setData('image', e.target.files[0]); setData('remove_image', false); }}
                                    className="hidden"
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => setConfirmingRemove(true)}
                                className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-[11px] font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium cursor-pointer transition-all">
                            <span>Choose Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => { setData('image', e.target.files[0]); setData('remove_image', false); }}
                                className="hidden"
                            />
                        </label>
                    )}
                    {errors.image && <p className="text-[11px] text-rose-500">{errors.image}</p>}
                </div>
            </div>

            {confirmingRemove && (
                <ConfirmModal
                    title="Remove badge image?"
                    message="The current badge image will be removed once you save."
                    danger
                    onConfirm={() => {
                        setData('remove_image', true);
                        setConfirmingRemove(false);
                    }}
                    onCancel={() => setConfirmingRemove(false)}
                />
            )}
        </>
    );
}