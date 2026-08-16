import React, { useState, useRef, useEffect } from 'react';

const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG;

export default function AdminLoginModal({ onClose }) {
    const [step, setStep] = useState('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const otpInputRef = useRef(null);

    useEffect(() => {
        if (step === 'otp') {
            otpInputRef.current?.focus();
        }
    }, [step]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && step !== 'redirecting') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose, step]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await window.axios.post(`/${ADMIN_SLUG}/login`, { email, password });
            setStep('otp');
        } catch (err) {
            const message = err.response?.data?.errors?.email?.[0] || 'Invalid credentials.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await window.axios.post(`/${ADMIN_SLUG}/verify`, { email, otp_code: otp });
            setStep('redirecting');
            window.location.href = response.data.redirect;
        } catch (err) {
            const message = err.response?.data?.errors?.otp_code?.[0] || 'Invalid or expired code.';
            setError(message);
            setLoading(false);
        }
    };

    const handleBackToCredentials = () => {
        setEmail('');
        setPassword('');
        setOtp('');
        setError('');
        setLoading(false);
        setStep('credentials');
    };

    const handleOverlayClick = () => {
        if (step !== 'redirecting') onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm px-4 py-8"
            onClick={handleOverlayClick}
        >
            <div
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[1.5rem] shadow-2xl border border-zinc-200 dark:border-white/5 p-8 sm:p-10"
                onClick={(e) => e.stopPropagation()}
            >
                {step !== 'redirecting' && (
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                )}

                {step === 'redirecting' ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-10">
                        <div className="w-10 h-10 rounded-full border-2 border-zinc-200 dark:border-zinc-800 border-t-emerald-500 animate-spin" />
                        <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Verified</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading dashboard, please wait...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                {step === 'credentials' ? 'Admin Login' : 'Verification Code'}
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
                                {step === 'credentials'
                                    ? 'Enter your admin credentials to continue.'
                                    : `A 6 digit code was sent to ${email}.`}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        {step === 'credentials' ? (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        autoComplete="off"
                                        className="w-full text-sm px-4 py-3 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-black/20 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            autoComplete="off"
                                            className="w-full text-sm px-4 py-3 pr-16 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-black/20 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full text-sm font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl py-3 mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Continue'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <input
                                    ref={otpInputRef}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    required
                                    autoComplete="off"
                                    className="w-full text-center tracking-[0.6em] text-2xl font-semibold px-4 py-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg py-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBackToCredentials}
                                    className="w-full text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors py-1"
                                >
                                    Back to login
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}