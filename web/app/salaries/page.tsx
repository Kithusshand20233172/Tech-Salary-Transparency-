'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { salaryApi } from '@/lib/api';
import Link from 'next/link';

export default function SalariesPage() {
    const router = useRouter();
    const [salaries, setSalaries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await salaryApi.get('/salaries');
                setSalaries(response.data);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    router.push('/auth/login');
                } else {
                    setError('Failed to load salaries.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSalaries();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col selection:bg-zinc-200">
            <nav className="border-b border-zinc-200 bg-white items-center">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2.5">
                        <Link href="/" className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xs">K</Link>
                        <span className="font-bold text-lg tracking-tight">Salaries</span>
                    </div>
                    <Link href="/">
                        <Button variant="ghost" className="text-sm">Back to Dashboard</Button>
                    </Link>
                </div>
            </nav>

            <main className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-12 space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Community Salaries</h1>
                        <p className="text-zinc-500">View salary data shared by the community.</p>
                    </div>
                    <Link href="/salary/submit">
                        <Button className="text-sm font-bold">Submit Yours</Button>
                    </Link>
                </div>

                {error ? (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                ) : (
                    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden overflow-x-auto shadow-sm">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Company</th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Experience</th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Salary</th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {salaries.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                                        onClick={() => router.push(`/salaries/${s.id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-zinc-900">{s.role}</div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wide">{s.level}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-600 font-medium">{s.company} ({s.country})</td>
                                        <td className="px-6 py-4 text-sm text-zinc-600 font-medium">{s.experienceYears}y</td>
                                        <td className="px-6 py-4 text-sm font-bold text-zinc-900">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: s.currency }).format(s.salaryAmount)}
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase ml-1">/ {s.period.replace('ly', '')}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                }`}>
                                                {s.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {salaries.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 font-medium">
                                            No salary submissions found yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
