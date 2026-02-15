'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Toast } from '@/components/ui/Toast';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated && searchParams.get('auth') === 'success') {
      setToastMessage('Successfully logged in');
      setShowToast(true);
      window.history.replaceState({}, '', '/');
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading || !isAuthenticated) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-200 flex">
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-zinc-200 bg-white">
        <div className="p-8">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xs uppercase tracking-tighter">
              K
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', active: true },
            { label: 'Project', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
            { label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
            { label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-black hover:bg-zinc-50'
                }`}
            >
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-xs font-bold text-zinc-500 hover:text-red-600">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Mobile only */}
        <nav className="lg:hidden border-b border-zinc-200 bg-white h-16 px-6 flex items-center justify-between">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xs">K</div>
          <button className="p-2 -mr-2 text-zinc-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </nav>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-12 animate-in fade-in duration-700">
            {/* Greeting */}
            <header className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 leading-none">
                Overview
              </h2>
              <p className="text-zinc-500 text-lg">
                Manage your community actions and identity.
              </p>
            </header>

            {/* Success Bar if just logged in */}
            {searchParams.get('auth') && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center space-x-3 text-emerald-800 text-sm font-medium animate-in slide-in-from-top-4 duration-500">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Session started successfully. All systems operational.</span>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Security Status', value: 'High', color: 'bg-emerald-50 text-emerald-700' },
                { label: 'Last Login', value: 'Today, 10:42', color: 'bg-zinc-100 text-zinc-700' },
                { label: 'Active Alerts', value: '0', color: 'bg-zinc-100 text-zinc-700' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-2.5">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Featured Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg px-1">Salary Transparency</h3>
                <div className="bg-white border border-zinc-200 rounded-[32px] p-8 flex flex-col justify-between h-[240px] group cursor-pointer hover:border-black transition-all" onClick={() => router.push('/salaries')}>
                  <div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold tracking-tight">View Salary Database</h4>
                    <p className="text-zinc-500 text-sm mt-1">Explore community-shared salary data and trends.</p>
                  </div>
                  <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-black transition-colors pt-4">
                    Explore Database
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg px-1">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-8 bg-black text-white rounded-3xl text-left hover:scale-[1.02] transition-transform shadow-lg shadow-black/10 flex flex-col h-full">
                    <svg className="w-6 h-6 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-9-4h18c1.104 0 2 .896 2 2v9c0 1.104-.896 2-2 2H3c-1.104 0-2-.896-2-2v-9c0-1.104.896-2 2-2z" />
                    </svg>
                    <span className="font-bold">New Action</span>
                  </button>
                  <button
                    className="p-8 bg-white border border-zinc-200 text-zinc-900 rounded-3xl text-left hover:bg-zinc-50 transition-colors flex flex-col h-full"
                    onClick={() => router.push('/stats')}
                  >
                    <svg className="w-6 h-6 mb-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002-2h2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="font-bold">Insights</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
