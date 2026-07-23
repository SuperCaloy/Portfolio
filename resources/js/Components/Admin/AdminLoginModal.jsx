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
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

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
            window.location.href = response.data.redirect;
        } catch (err) {
            const message = err.response?.data?.errors?.otp_code?.[0] || 'Invalid or expired code.';
            setError(message);
        } finally {
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

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    {step === 'credentials' ? 'Admin Login' : 'Enter Verification Code'}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
                    {step === 'credentials'
                        ? 'Enter your admin credentials to continue.'
                        : `A 6 digit code was sent to ${email}.`}
                </p>

                {error && (
                    <div className="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md px-3 py-2">
                        {error}
                    </div>
                )}

                {step === 'credentials' ? (
                    <form onSubmit={handleSendOtp} className="space-y-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            autoComplete="off"
                            className="w-full text-sm px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                autoComplete="off"
                                className="w-full text-sm px-3 py-2 pr-16 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Sending code...' : 'Continue'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                        <input
                            ref={otpInputRef}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="6 digit code"
                            required
                            autoComplete="off"
                            className="w-full text-center tracking-[0.5em] text-lg font-semibold px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                        <button
                            type="button"
                            onClick={handleBackToCredentials}
                            className="w-full text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        >
                            Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}