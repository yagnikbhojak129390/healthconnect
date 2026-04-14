'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, UserRole, ROLE_PERMISSIONS, RolePermissions } from './types';

// Mock users for development (used as fallback when database is not available)
const MOCK_USERS: User[] = [
    {
        id: '1',
        name: 'Yagnik',
        email: 'admin@healthconnect.gov.in',
        role: 'admin',
        district: 'Kamrup',
        phone: '+91 9876543210',
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date(),
        isActive: true,
    },
    {
        id: '2',
        name: 'Yagnik',
        email: 'yagnik@healthconnect.gov.in',
        role: 'health_worker',
        district: 'East Khasi Hills',
        village: 'Shillong',
        phone: '+91 9876543211',
        createdAt: new Date('2024-02-15'),
        lastLogin: new Date(),
        isActive: true,
    },
    {
        id: '3',
        name: 'Lakshmi Devi',
        email: 'lakshmi@healthconnect.gov.in',
        role: 'health_worker',
        district: 'Ri Bhoi',
        village: 'Nongpoh',
        phone: '+91 9876543212',
        createdAt: new Date('2024-03-01'),
        lastLogin: new Date(),
        isActive: true,
    },
];

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    permissions: RolePermissions | null;
    login: (email: string, password: string) => Promise<{ success: boolean; role?: UserRole }>;
    logout: () => void;
    hasPermission: (permission: keyof RolePermissions) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('healthconnect_user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser({
                    ...parsed,
                    createdAt: new Date(parsed.createdAt),
                    lastLogin: new Date(),
                });
            } catch {
                localStorage.removeItem('healthconnect_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; role?: UserRole }> => {
        setIsLoading(true);

        // Helper to check mock users
        const tryMockAuth = () => {
            const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (foundUser) {
                const updatedUser = { ...foundUser, lastLogin: new Date() };
                setUser(updatedUser);
                localStorage.setItem('healthconnect_user', JSON.stringify(updatedUser));
                setIsLoading(false);
                return { success: true, role: foundUser.role } as { success: boolean; role?: UserRole };
            }
            setIsLoading(false);
            return { success: false } as { success: boolean; role?: UserRole };
        };

        try {
            // Try database authentication first with a timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    const dbUser: User = {
                        ...data.user,
                        createdAt: new Date(),
                        lastLogin: new Date(),
                    };
                    setUser(dbUser);
                    localStorage.setItem('healthconnect_user', JSON.stringify(dbUser));
                    setIsLoading(false);
                    return { success: true, role: dbUser.role as UserRole };
                }
            }

            // Fallback to mock users if database auth fails
            return tryMockAuth();

        } catch (error) {
            // If API fails (e.g., no database, timeout), fallback to mock users
            console.log('Database auth failed, using mock auth:', error);
            return tryMockAuth();
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('healthconnect_user');
    }, []);

    const permissions = user ? ROLE_PERMISSIONS[user.role] : null;

    const hasPermission = useCallback((permission: keyof RolePermissions): boolean => {
        return permissions?.[permission] ?? false;
    }, [permissions]);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            permissions,
            login,
            logout,
            hasPermission,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { MOCK_USERS };
