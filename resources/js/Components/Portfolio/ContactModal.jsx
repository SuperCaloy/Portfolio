import React from 'react';
import Modal from '../Shared/Modal';
import { useContactForm } from '../../hooks/useContactForm';
import ContactFields from './ContactFields';

export default function ContactModal({ isOpen, onClose }) {
    const { formData, status, setStatus, handleChange, handleSubmit } = useContactForm({
        onSuccess: () => {
            setTimeout(() => {
                onClose();
                setStatus({ loading: false, success: false, error: null });
            }, 2000);
        },
    });

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
                        <ContactFields formData={formData} handleChange={handleChange} status={status} compact={true} />

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