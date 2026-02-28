"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import api from '@/lib/api';

const isProd = process.env.NODE_ENV === 'production';

interface AuthContextType {
    user: any | null; // Loosened type for Dev Mode
    loading: boolean;
    dbUser: any | null;
    login: () => void;
    logout: () => void;
    enableTestMode: () => void;
    enableAdminTestMode: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Test User Object
const TEST_USER = {
    uid: 'test-uid-123',
    phoneNumber: '+919988776655',
    displayName: 'Telangana Citizen',
    email: 'citizen@telangana.gov.in',
    getIdToken: async () => 'dev-token'
};

const TEST_ADMIN = {
    uid: 'admin-uid-999',
    phoneNumber: '+910000000000',
    displayName: 'Govt Official (Admin)',
    email: 'admin@telangana.gov.in',
    getIdToken: async () => 'admin-token'
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [dbUser, setDbUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                handleUserSync(firebaseUser);
            } else if (!isProd) {
                const isTestMode = localStorage.getItem('testMode') === 'true';
                const isAdminMode = localStorage.getItem('adminMode') === 'true';

                if (isTestMode) {
                    if (isAdminMode) {
                        handleUserSync(TEST_ADMIN);
                    } else {
                        handleUserSync(TEST_USER);
                    }
                } else {
                    setUser(null);
                    setDbUser(null);
                    setLoading(false);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleUserSync = async (u: any) => {
        setUser(u);
        try {
            // Sync with backend
            const isTestUser = u.uid === 'test-uid-123';
            const isAdminUser = u.uid === 'admin-uid-999';

            // Priority: If in test mode, pre-set the role to ensure dashboard works
            if (isTestUser) setDbUser({ uid: u.uid, role: 'user', name: u.displayName });
            if (isAdminUser) setDbUser({ uid: u.uid, role: 'admin', name: u.displayName });

            let tokenHeader = {};
            if (isTestUser) tokenHeader = { Authorization: 'Bearer dev-token' };
            if (isAdminUser) tokenHeader = { Authorization: 'Bearer admin-token' };

            const { data } = await api.post('/auth/login', {
                name: u.displayName || 'Citizen'
            }, {
                headers: tokenHeader
            });
            setDbUser(data.user);
        } catch (error) {
            // Fallback: Ensure test users can still access their respective areas
            if (u.uid === 'admin-uid-999') setDbUser({ uid: u.uid, role: 'admin', name: u.displayName });
            else if (u.uid === 'test-uid-123') setDbUser({ uid: u.uid, role: 'user', name: u.displayName });
        } finally {
            setLoading(false);
        }
    };

    const login = () => { };

    const logout = () => {
        auth.signOut();
        localStorage.removeItem('testMode');
        localStorage.removeItem('adminMode');
        setUser(null);
        setDbUser(null);
        window.location.href = '/login';
    };

    const enableTestMode = () => {
        localStorage.setItem('testMode', 'true');
        handleUserSync(TEST_USER);
        window.location.href = '/';
    };

    const enableAdminTestMode = () => {
        localStorage.setItem('testMode', 'true');
        localStorage.setItem('adminMode', 'true');
        // Clear any old user data to prevent race conditions during sync
        setUser(TEST_ADMIN);
        window.location.href = '/admin/dashboard';
    };

    return (
        <AuthContext.Provider value={{ user, dbUser, loading, login, logout, enableTestMode, enableAdminTestMode }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
