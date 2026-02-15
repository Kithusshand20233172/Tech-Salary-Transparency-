'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { salaryApi } from '@/lib/api';
import { Toast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function SalaryDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [salary, setSalary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
        const fetchDetails = async () => {
            try {
                const response = await salaryApi.get(`/salaries/${id}`);
                setSalary(response.data);
            } catch (err) {
                setError('Could not find salary details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdatingStatus(true);
        try {
            await salaryApi.patch(`/salaries/${id}/status`, { status: newStatus });
            const response = await salaryApi.get(`/salaries/${id}`);
            setSalary(response.data);
            setToast(`Status updated to ${newStatus}`);
        } catch (err) {
            setToast('Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
        </div>
    );

    if (error || !salary) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
            <p className="text-zinc-500 font-medium">{error || 'Salary not found'}</p>
            <Link href="/salaries"><Button variant="outline">Back to List</Button></Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col selection:bg-zinc-200">
            {toast && <Toast message={toast} onClose={() => setToast('')} />}

            <nav className="border-b border-zinc-200 bg-white">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/salaries" className="flex items-center text-sm font-bold text-zinc-500 hover:text-black transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Database
                    </Link>
                    <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                        ID: {salary.id.substring(0, 8)}
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 lg:p-12 space-y-12 animate-in fade-in duration-500">
                <header className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                                {salary.status}
                            </span>
                            {salary.isAnonymous && (
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                                    Anonymous
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">{salary.role}</h1>
                        <p className="text-xl text-zinc-500 font-medium">{salary.company} • {salary.country}</p>
                    </div>

                    <div className="flex items-center space-x-6 p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Experience</p>
                            <p className="text-2xl font-bold">{salary.experienceYears}y <span className="text-sm text-zinc-400">{salary.level}</span></p>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-black text-white p-10 rounded-[40px] space-y-2 group shadow-2xl shadow-black/10">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Total Compensation</p>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-5xl font-bold tracking-tighter">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: salary.currency, maximumFractionDigits: 0 }).format(salary.salaryAmount)}
                            </span>
                            <span className="text-zinc-500 font-bold uppercase text-sm">/ {salary.period.replace('ly', '')}</span>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 p-10 rounded-[40px] flex flex-col justify-center space-y-6">
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">Verified Submission</h3>
                            <p className="text-sm text-zinc-500 font-medium">
                                This salary was submitted anonymously and is subject to community moderation.
                            </p>
                        </div>
                    </div>
                </section>

                {isLoggedIn && (
                    <section className="bg-white border border-zinc-200 p-8 lg:p-12 rounded-[40px] space-y-8">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold tracking-tight">Status Moderation</h3>
                            <p className="text-zinc-500 text-sm">Update the submission status to reflect its validity.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Button
                                onClick={() => handleStatusUpdate('APPROVED')}
                                className={`py-4 ${salary.status === 'APPROVED' ? 'bg-emerald-600 border-emerald-600' : 'bg-black'}`}
                                isLoading={updatingStatus && salary.status !== 'APPROVED'}
                                disabled={salary.status === 'APPROVED'}
                            >
                                Approve
                            </Button>

                            <Button
                                onClick={() => handleStatusUpdate('REJECTED')}
                                variant="outline"
                                className={`py-4 border-red-200 text-red-600 hover:bg-red-50 ${salary.status === 'REJECTED' ? 'bg-red-50 border-red-300' : ''}`}
                                isLoading={updatingStatus && salary.status !== 'REJECTED'}
                                disabled={salary.status === 'REJECTED'}
                            >
                                Deny
                            </Button>

                            <Button
                                onClick={() => handleStatusUpdate('PENDING')}
                                variant="ghost"
                                className={`py-4 text-zinc-500 hover:text-black ${salary.status === 'PENDING' ? 'bg-zinc-100' : ''}`}
                                isLoading={updatingStatus && salary.status !== 'PENDING'}
                                disabled={salary.status === 'PENDING'}
                            >
                                Pending
                            </Button>
                        </div>
                    </section>
                )}

                <footer className="pt-12 border-t border-zinc-100 flex flex-col items-center space-y-4">
                    <p className="text-zinc-400 text-sm font-medium">Shared on {new Date(salary.submittedAt).toLocaleDateString()}</p>
                    <Link href="/stats">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black cursor-pointer transition-colors underline underline-offset-4 decoration-zinc-200 hover:decoration-black">
                            Check Community Stats
                        </span>
                    </Link>
                </footer>
            </main>
        </div>
    );
}
