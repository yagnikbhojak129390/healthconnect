'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';
import WorkerSidebar from '@/components/layout/WorkerSidebar';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
        // Redirect admins to admin dashboard
        if (!isLoading && isAuthenticated && user?.role === 'admin') {
            router.push('/admin');
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
            <WorkerSidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default function WorkerLayout({
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
