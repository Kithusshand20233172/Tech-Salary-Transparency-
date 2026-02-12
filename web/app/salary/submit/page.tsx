'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { Toast } from '@/components/ui/Toast';

export default function SalarySubmitPage() {
    const [formData, setFormData] = useState({
        country: '',
        company: '',
        role: '',
        experienceYears: '0',
        level: '',
        salaryAmount: '0',
        currency: 'USD',
        period: 'Yearly',
        isAnonymous: true
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dataToSubmit = {
                ...formData,
                experienceYears: parseInt(formData.experienceYears as string) || 0,
                salaryAmount: parseFloat(formData.salaryAmount as string) || 0
            };
            await api.post('/Salaries', dataToSubmit);
            setSubmitted(true);
        } catch (err: any) {
            const backendError = err.response?.data;
            if (backendError?.errors) {
                const messages = Object.values(backendError.errors).flat().join(' ');
                setError(messages);
            } else {
                setError(backendError?.message || 'Failed to submit. Please check if the backend is running.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-white">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Submitted (PENDING)</h1>
                    <p className="text-zinc-500 text-lg leading-relaxed">
                        Thank you for contributing to community transparency. Your submission is being reviewed.
                    </p>
                    <div className="pt-4">
                        <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full">
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50/50 py-12 px-6">
            <div className="max-w-xl mx-auto space-y-10">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Submit Salary Info</h1>
                    <p className="text-zinc-500 text-lg">Contribute anonymously to the community. No login required.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-[32px] p-8 lg:p-12 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Country"
                            placeholder="e.g. USA, UK"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            required
                        />
                        <Input
                            label="Company"
                            placeholder="e.g. Google, Startup Inc"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Role / Title"
                            placeholder="e.g. Software Engineer"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        />
                        <Input
                            label="Level"
                            placeholder="e.g. Senior, L5"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Experience (Years)"
                            type="number"
                            value={formData.experienceYears}
                            onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                            required
                        />
                        <Input
                            label="Currency"
                            placeholder="USD"
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Salary Amount"
                            type="number"
                            value={formData.salaryAmount}
                            onChange={(e) => setFormData({ ...formData, salaryAmount: e.target.value })}
                            required
                        />
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-700 ml-0.5">Period</label>
                            <select
                                className="w-full pl-4 pr-10 py-2 bg-white border border-zinc-200 rounded-lg outline-none focus:border-black text-zinc-900"
                                value={formData.period}
                                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            >
                                <option value="Yearly">Yearly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-zinc-900">Anonymize</p>
                            <p className="text-xs text-zinc-500 font-medium">Keep your info private from others</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${formData.isAnonymous ? 'bg-black' : 'bg-zinc-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isAnonymous ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>

                    {error && <p className="text-sm font-medium text-red-500">{error}</p>}

                    <Button type="submit" className="w-full py-4 text-lg" isLoading={loading}>
                        Submit Salary Profile
                    </Button>
                </form>
            </div>
        </div>
    );
}
