'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { salaryApi } from '@/lib/api';
import Link from 'next/link';

export default function StatsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        country: '',
        role: '',
        level: ''
    });
    const searchParams = useSearchParams();

    const fetchStats = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.country) params.append('country', filters.country);
            if (filters.role) params.append('role', filters.role);
            if (filters.level) params.append('level', filters.level);

            const response = await salaryApi.get(`/salaries/stats?${params.toString()}`);
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col selection:bg-zinc-200">
            <nav className="border-b border-zinc-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xs">K</div>
                        <span className="font-bold text-lg tracking-tight">Insights</span>
                    </Link>
                    <Link href="/salaries"><Button variant="ghost" className="text-sm">View Database</Button></Link>
                </div>
            </nav>

            <main className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-12 space-y-12 animate-in fade-in duration-500">
                <header className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Community Insights</h1>
                    <p className="text-zinc-500 text-lg">Aggregated salary data from approved community submissions.</p>
                </header>

                <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-zinc-200 p-6 rounded-[32px] space-y-6">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Filters</h3>
                            <div className="space-y-4">
                                <Input label="Country" placeholder="All" value={filters.country} onChange={(e) => handleFilterChange('country', e.target.value)} />
                                <Input label="Role" placeholder="All" value={filters.role} onChange={(e) => handleFilterChange('role', e.target.value)} />
                                <Input label="Level" placeholder="All" value={filters.level} onChange={(e) => handleFilterChange('level', e.target.value)} />
                                <Button onClick={fetchStats} className="w-full">Apply Filters</Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Display */}
                    <div className="lg:col-span-3 space-y-8">
                        {loading ? (
                            <div className="bg-white border border-zinc-200 p-20 rounded-[40px] flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
                            </div>
                        ) : stats && stats.count > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-black text-white p-10 rounded-[40px] space-y-2">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Average Salary</p>
                                        <p className="text-5xl font-bold tracking-tighter">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.average)}
                                        </p>
                                        <p className="text-xs text-zinc-500 font-medium">Based on {stats.count} approved records</p>
                                    </div>
                                    <div className="bg-white border border-zinc-200 p-10 rounded-[40px] space-y-2">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Median (P50)</p>
                                        <p className="text-5xl font-bold tracking-tighter">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.median)}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white border border-zinc-200 p-10 rounded-[40px] space-y-2">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Lower Quartile (P25)</p>
                                        <p className="text-3xl font-bold tracking-tight">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.p25)}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-zinc-200 p-10 rounded-[40px] space-y-2">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Upper Quartile (P75)</p>
                                        <p className="text-3xl font-bold tracking-tight">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.p75)}
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white border border-zinc-200 p-20 rounded-[40px] text-center space-y-4">
                                <p className="text-zinc-500 font-medium text-lg">No approved records found matching these filters.</p>
                                <p className="text-zinc-400 text-sm">Statistics are only calculated from submissions with the "APPROVED" status.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
