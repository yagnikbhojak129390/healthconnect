'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';
import Sidebar from '@/components/layout/Sidebar';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
        // Redirect health workers to worker dashboard
        if (!isLoading && isAuthenticated && user?.role === 'health_worker') {
            router.push('/worker');
        }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gray-50)',
            }}>
                <div className="loading-spinner" style={{ width: 40, height: 40 }} />
            </div>
        );
    }

    // Don't render until authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ProtectedLayout>{children}</ProtectedLayout>
        </AuthProvider>
    );
}
