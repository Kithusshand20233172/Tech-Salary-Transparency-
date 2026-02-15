'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SignupPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await authApi.post('/auth/signup', { email, password });
            const { token, email: userEmail } = response.data;

            // Sync token with API client
            const { setAccessToken } = await import('@/lib/api');
            setAccessToken(token);

            login(token, { email: userEmail });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white relative">
            <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xs">K</div>
                </Link>
                <Link href="/salary/submit">
                    <Button className="text-sm font-bold">
                        Submit Salary Info
                    </Button>
                </Link>
            </header>
            <div className="w-full max-w-[380px] space-y-8">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Create an account</h1>
                    <p className="text-sm text-zinc-500">
                        Enter your email below to create your account
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <div className="text-sm font-medium text-red-500 px-1">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Create Account
                    </Button>
                </form>

                <p className="text-center text-sm text-zinc-500">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-black font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
