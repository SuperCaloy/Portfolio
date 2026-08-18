import axios from 'axios';
import React, { useState } from 'react';
import Modal from '../Shared/Modal';

export default function ContactModal({ isOpen, onClose }) {
    const MESSAGE_MAX_LENGTH = 1000;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '', // honeypot, must stay empty, hidden from real users
    });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            await axios.post('/api/contact', formData);
            setStatus({ loading: false, success: true, error: null });
            setFormData({ name: '', email: '', subject: '', message: '', website: '' });
            setTimeout(() => {
                onClose();
                setStatus({ loading: false, success: false, error: null });
            }, 2000);
        } catch (err) {
            setStatus({
                loading: false,
                success: false,
                error: err.response?.data?.message || 'Failed to send message. Please try again.',
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl" ariaLabel="Send a Message">
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">Send a Message</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {status.success ? (
                    <div className="py-8 text-center space-y-2" role="status" aria-live="polite">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Message Sent!</h3>
                        <p className="text-sm text-zinc-500">Thanks for reaching out. I will get back to you soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {status.error && (
                            <div
                                className="p-3 text-sm rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                                role="alert"
                                aria-live="assertive"
                            >
                                {status.error}
                            </div>
                        )}

                        {/* Honeypot field, hidden from real users, bots tend to fill every field */}
                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            tabIndex="-1"
                            autoComplete="off"
                            className="absolute -left-[9999px] w-px h-px opacity-0"
                            aria-hidden="true"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                autoComplete="off"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Project Inquiry / Job Opportunity"
                                className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
                                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600">
                                    {formData.message.length}/{MESSAGE_MAX_LENGTH}
                                </span>
                            </div>
                            <textarea
                                name="message"
                                id="message"
                                required
                                rows="6"
                                maxLength={MESSAGE_MAX_LENGTH}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-y"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status.loading}
                            className="w-full py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-sm transition-all disabled:opacity-50"
                        >
                            {status.loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </Modal>
    );
}