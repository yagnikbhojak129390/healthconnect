'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { ROLE_LABELS } from '@/lib/auth/types';
import {
    LayoutDashboard,
    Activity,
    Droplets,
    BookOpen,
    ClipboardList,
    Bell,
    LogOut,
    Menu,
    X,
    Wifi,
    WifiOff,
    Home
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
}

const navItems: NavItem[] = [
    { href: '/worker', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/worker/report', label: 'Report Symptoms', icon: Activity },
    { href: '/worker/water-test', label: 'Water Testing', icon: Droplets },
    { href: '/worker/tasks', label: 'My Tasks', icon: ClipboardList },
    { href: '/worker/learn', label: 'Training', icon: BookOpen },
    { href: '/worker/alerts', label: 'Alerts', icon: Bell },
];

export default function WorkerSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [pendingSync, setPendingSync] = useState(2);

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const isActive = (href: string) => {
        if (href === '/worker') return pathname === '/worker';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                className="btn btn-icon btn-ghost"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    top: 'var(--space-4)',
                    left: 'var(--space-4)',
                    zIndex: 301,
                    display: 'none',
                }}
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar - Light Theme */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{
                            width: 36,
                            height: 36,
                            background: 'linear-gradient(135deg, #ff9933 0%, #e68a00 100%)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Activity size={20} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <div className="sidebar-brand" style={{ color: '#e68a00' }}>HealthConnect</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                Health Worker Portal
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sync Status */}
                <div style={{
                    margin: 'var(--space-4)',
                    padding: 'var(--space-3)',
                    background: isOnline ? 'var(--success-light)' : 'var(--warning-light)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: 'var(--text-xs)',
                    border: `1px solid ${isOnline ? 'var(--success)' : 'var(--warning)'}`,
                }}>
                    {isOnline ? <Wifi size={14} style={{ color: 'var(--success)' }} /> : <WifiOff size={14} style={{ color: 'var(--warning)' }} />}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: isOnline ? 'var(--success)' : 'var(--warning)' }}>
                            {isOnline ? 'Online' : 'Offline Mode'}
                        </div>
                        {pendingSync > 0 && (
                            <div style={{ color: 'var(--gray-600)', marginTop: 2 }}>
                                {pendingSync} items pending sync
                            </div>
                        )}
                    </div>
                    {isOnline && pendingSync > 0 && (
                        <button
                            style={{
                                background: 'var(--success)',
                                color: 'white',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                            onClick={() => setPendingSync(0)}
                        >
                            Sync
                        </button>
                    )}
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                            style={isActive(item.href) ? {
                                background: '#fff7ed',
                                color: '#e68a00',
                                borderColor: '#ffcc99',
                            } : {}}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                            {item.href === '/worker/alerts' && (
                                <span style={{
                                    marginLeft: 'auto',
                                    background: 'var(--danger)',
                                    color: 'white',
                                    fontSize: 'var(--text-xs)',
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 600,
                                }}>
                                    3
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Back to Main Site */}
                <div style={{
                    padding: 'var(--space-4)',
                    borderTop: '1px solid var(--color-border)',
                }}>
                    <Link href="/" className="sidebar-link">
                        <Home size={18} />
                        <span>Main Website</span>
                    </Link>
                </div>

                {/* User Section */}
                {user && (
                    <div style={{
                        padding: 'var(--space-4)',
                        borderTop: '1px solid var(--color-border)',
                        background: 'var(--gray-50)',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            marginBottom: 'var(--space-3)',
                        }}>
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 'var(--radius-full)',
                                background: 'linear-gradient(135deg, #ff9933 0%, #e68a00 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: 'var(--text-sm)',
                            }}>
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontWeight: 600,
                                    fontSize: 'var(--text-sm)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: 'var(--gray-800)',
                                }}>
                                    {user.name}
                                </div>
                                <div style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    {user.village || user.district}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="sidebar-link"
                            style={{
                                width: '100%',
                                border: 'none',
                                background: 'var(--gray-100)',
                                cursor: 'pointer',
                                justifyContent: 'center',
                            }}
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 199,
                    }}
                />
            )}

            <style jsx>{`
                @media (max-width: 1024px) {
                    button[aria-label="Toggle menu"] {
                        display: flex !important;
                    }
                }
            `}</style>
        </>
    );
}
