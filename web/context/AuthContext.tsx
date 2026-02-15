'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

interface AuthContextType {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData?: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const tokenExpiryTimer = useRef<NodeJS.Timeout | null>(null);

    const logout = useCallback(async () => {
        try {
            await authApi.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            if (tokenExpiryTimer.current) {
                clearTimeout(tokenExpiryTimer.current);
            }
            setToken(null);
            setUser(null);
            router.push('/auth/login');
        }
    }, [router]);

    const refreshAccessToken = useCallback(async () => {
        try {
            const response = await authApi.post('/auth/refresh');
            const { token: newToken, email } = response.data;
            setToken(newToken);
            setUser({ email });
            scheduleTokenRefresh(newToken);
            return newToken;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            return null;
        }
    }, [logout]);

    const scheduleTokenRefresh = useCallback((accessToken: string) => {
        if (tokenExpiryTimer.current) {
            clearTimeout(tokenExpiryTimer.current);
        }

        try {
            // Decode JWT to get expiry time
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const expiresAt = payload.exp * 1000; // Convert to milliseconds
            const now = Date.now();
            const timeUntilExpiry = expiresAt - now;

            // Refresh 1 minute before expiry
            const refreshTime = Math.max(timeUntilExpiry - 60000, 0);

            tokenExpiryTimer.current = setTimeout(() => {
                refreshAccessToken();
            }, refreshTime);
        } catch (error) {
            console.error('Error scheduling token refresh:', error);
        }
    }, [refreshAccessToken]);

    const login = useCallback((newToken: string, userData?: any) => {
        setToken(newToken);
        if (userData) {
            setUser(userData);
        }
        scheduleTokenRefresh(newToken);
        router.push('/');
    }, [router, scheduleTokenRefresh]);

    // Sync token with API client whenever it changes
    useEffect(() => {
        const syncToken = async () => {
            const { setAccessToken } = await import('@/lib/api');
            setAccessToken(token);
        };
        syncToken();
    }, [token]);

    useEffect(() => {
        // Try to refresh token on mount
        const initAuth = async () => {
            try {
                const response = await authApi.post('/auth/refresh');
                const { token: newToken, email } = response.data;
                setToken(newToken);
                setUser({ email });
                scheduleTokenRefresh(newToken);
            } catch (error) {
                // No valid refresh token, user needs to login
                console.log('No valid session found');
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        return () => {
            if (tokenExpiryTimer.current) {
                clearTimeout(tokenExpiryTimer.current);
            }
        };
    }, [scheduleTokenRefresh]);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
