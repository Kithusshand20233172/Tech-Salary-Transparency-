'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authApi.post('/auth/login', { email, password });
            const { token, email: userEmail } = response.data;

            // Sync token with API client
            const { setAccessToken } = await import('@/lib/api');
            setAccessToken(token);

            login(token, { email: userEmail });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials.');
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
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Sign in</h1>
                    <p className="text-sm text-zinc-500">
                        Enter your email below to login to your account
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-700 ml-0.5">Password</label>
                            <Link href="#" className="text-xs text-zinc-500 hover:text-black hover:underline">
                                Forgot your password?
                            </Link>
                        </div>
                        <Input
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-sm font-medium text-red-500 px-1">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign In
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-100" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-zinc-400">Or continue with</span>
                    </div>
                </div>

                <p className="text-center text-sm text-zinc-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/signup" className="text-black font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
