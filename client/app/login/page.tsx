"use client";

import { useState } from 'react';

const isDev = process.env.NODE_ENV !== 'production';
import { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const { enableTestMode, enableAdminTestMode } = useAuth();
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const setupRecaptcha = () => {
        if (!(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'normal',
                'callback': () => {
                    // reCAPTCHA solved
                }
            });
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            setupRecaptcha();
            const appVerifier = (window as any).recaptchaVerifier;
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

            const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(result);
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send OTP. Try again.');
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await confirmationResult.confirm(otp);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            setError('Invalid OTP. Please try again.');
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // AuthContext's onAuthStateChanged will handle the rest
            router.push('/');
        } catch (err: any) {
            console.error("Google Login Error:", err);
            setError('Failed to sign in with Google.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-center text-indigo-900 mb-6">Citizen Login</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                    {error}
                </div>
            )}

            {!confirmationResult ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                +91
                            </span>
                            <input
                                type="tel"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md outline-none border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="9876543210"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div id="recaptcha-container" className="mb-4"></div>

                    <Button type="submit" className="w-full" isLoading={loading} disabled={phoneNumber.length < 10}>
                        Send OTP
                    </Button>

                    {isDev && (
                        <>
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white px-2 text-gray-500">For Testing</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                                onClick={() => enableTestMode()}
                            >
                                Test Login (Skip OTP)
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full text-purple-700 border-purple-200 hover:bg-purple-50 mt-3"
                                onClick={() => enableAdminTestMode()}
                            >
                                Login as Admin (Officer)
                            </Button>
                        </>
                    )}

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                        onClick={handleGoogleLogin}
                        isLoading={loading}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <Input
                        label="Enter OTP"
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                        className="text-center tracking-[0.5em] text-lg"
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Verify & Login
                    </Button>

                    <button
                        type="button"
                        onClick={() => setConfirmationResult(null)}
                        className="w-full text-indigo-600 text-sm hover:underline"
                    >
                        Change Number
                    </button>
                </form>
            )}
        </div>
    );
}
