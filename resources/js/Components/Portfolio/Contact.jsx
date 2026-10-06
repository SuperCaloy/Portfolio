import React from 'react';
import { useContactForm } from '../../hooks/useContactForm';
import ContactFields from './ContactFields';

export default function Contact() {
    const { formData, status, setStatus, handleChange, handleSubmit } = useContactForm({
        onSuccess: () => {
            setTimeout(() => {
                setStatus({ loading: false, success: false, error: null });
            }, 5000);
        },
    });

    return (
        <section id="contact" className="py-24 sm:py-32 relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-400/5 dark:bg-emerald-500/5 blur-[120px] rounded-full will-change-transform translate-z-0" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                    {/* Editorial Split: Left Side */}
                    <div className="w-full md:w-5/12 flex flex-col justify-start">
                        <div className="inline-flex px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 w-max mb-8">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase">Contact</span>
                        </div>
                        <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.05] text-balance">
                            Let's build<br/><span className="text-emerald-600 dark:text-emerald-400">together.</span>
                        </h2>
                        <p className="mt-6 text-lg text-zinc-500 dark:text-zinc-400 max-w-sm">
                            Have a project in mind or looking for an engineer? Drop a message and I'll get back to you shortly.
                        </p>
                    </div>

                    {/* Form Side */}
                    <div className="w-full md:w-7/12">
                        <div className="p-2 sm:p-2.5 rounded-[2.5rem] bg-zinc-100/50 dark:bg-white/5 ring-1 ring-zinc-200/50 dark:ring-white/10 shadow-ambient">
                            <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.25rem] p-6 sm:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                {status.success ? (
                                    <div className="py-16 text-center space-y-4" role="status" aria-live="polite">
                                        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center ring-4 ring-emerald-50/50 dark:ring-emerald-900/20">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Message Sent!</h3>
                                        <p className="text-base text-zinc-500">Thanks for reaching out. I will get back to you soon.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <ContactFields formData={formData} handleChange={handleChange} status={status} />

                                        <button
                                            type="submit"
                                            disabled={status.loading}
                                            className="group flex items-center justify-between w-full pl-6 pr-2 py-2 rounded-full bg-emerald-800 text-white font-semibold text-base transition-all duration-700 ease-fluid shadow-[0_0_40px_-10px_rgba(5,150,105,0.4)] hover:shadow-[0_0_60px_-15px_rgba(5,150,105,0.6)] hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 ring-1 ring-white/20"
                                        >
                                            <span>{status.loading ? 'Sending...' : 'Send Message'}</span>
                                            <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 group-hover:scale-105 transition-all duration-700 ease-fluid">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </span>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
